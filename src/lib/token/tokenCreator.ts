import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { toast } from "@/components/ui/use-toast";
import { fetchWithRetry, ApiError } from "@/lib/utils/apiUtils";
import bs58 from "bs58";

const PUMP_API_BASE = 'https://pump.fun/api';
const PUMP_PORTAL_API_BASE = 'https://pumpportal.fun/api';

interface CreateTokenResponse {
  success: boolean;
  message: string;
  signature?: string;
  txUrl?: string;
}

async function uploadMetadataToIPFS(metadata: TokenMetadata): Promise<string> {
  const formData = new FormData();
  formData.append("file", metadata.pfpImage);
  formData.append("name", metadata.name);
  formData.append("symbol", metadata.symbol);
  formData.append("description", metadata.description);
  formData.append("twitter", metadata.twitter || "");
  formData.append("telegram", metadata.telegram || "");
  formData.append("website", metadata.website || "");
  formData.append("showName", "true");

  try {
    const response = await fetchWithRetry(`${PUMP_API_BASE}/ipfs`, {
      method: "POST",
      body: formData,
    }, {
      maxRetries: 5,
      baseDelay: 2000,
    });

    const data = await response.json();
    if (!data.metadataUri) {
      throw new Error("Failed to get metadata URI from IPFS");
    }

    return data.metadataUri;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload token metadata. Please try again.");
  }
}

async function getCreateTransaction(
  publicKey: string,
  metadata: TokenMetadata,
  metadataUri: string,
  initialBuyAmount: number
): Promise<Uint8Array> {
  try {
    const response = await fetchWithRetry(`${PUMP_PORTAL_API_BASE}/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey,
        action: "create",
        tokenMetadata: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadataUri,
        },
        denominatedInSol: "true",
        amount: initialBuyAmount,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump"
      })
    });

    const data = await response.arrayBuffer();
    if (!data || data.byteLength === 0) {
      throw new Error("Received empty transaction data");
    }

    return new Uint8Array(data);
  } catch (error) {
    console.error("Transaction creation error:", error);
    throw new Error("Failed to create token transaction. Please try again.");
  }
}

async function sendTransactionWithRetry(
  connection: Connection,
  transaction: VersionedTransaction,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const signature = await connection.sendTransaction(transaction, {
        maxRetries: 3,
        skipPreflight: false,
      });
      
      const confirmation = await connection.confirmTransaction(signature, {
        commitment: 'confirmed',
        maxRetries: 3,
      });
      
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed: ${confirmation.value.err}`);
      }
      
      return signature;
    } catch (error) {
      console.error(`Transaction attempt ${i + 1} failed:`, error);
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after multiple attempts');
}

export const createToken = async (
  metadata: TokenMetadata,
  initialBuyAmount: number,
  wallet: WalletContextState
): Promise<CreateTokenResponse> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  // Validate inputs before making any API calls
  if (!metadata.pfpImage || !metadata.name || !metadata.symbol) {
    throw new Error("Missing required token information");
  }

  const connection = new Connection(
    import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
    {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    }
  );

  try {
    // Show initial loading toast
    toast({
      title: "Creating Token",
      description: "Uploading metadata to IPFS...",
    });

    // Step 1: Upload metadata to IPFS
    const metadataUri = await uploadMetadataToIPFS(metadata);

    toast({
      title: "Metadata Uploaded",
      description: "Preparing transaction...",
    });

    // Step 2: Get the create transaction
    const txData = await getCreateTransaction(
      wallet.publicKey.toBase58(),
      metadata,
      metadataUri,
      initialBuyAmount
    );

    // Step 3: Process and sign the transaction
    const tx = VersionedTransaction.deserialize(txData);
    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaction Signed",
      description: "Sending to network...",
    });

    // Step 4: Send and confirm the transaction
    const signature = await sendTransactionWithRetry(connection, signedTx);

    toast({
      title: "Success!",
      description: `Token created successfully! View on Solscan: https://solscan.io/tx/${signature}`,
    });

    return {
      success: true,
      message: "Token created successfully!",
      signature,
      txUrl: `https://solscan.io/tx/${signature}`,
    };

  } catch (error) {
    console.error("Error creating token:", error);
    
    let errorMessage = "Failed to create token";
    if (error instanceof ApiError) {
      switch (error.status) {
        case 404:
          errorMessage = "API endpoint not found. Please try again later.";
          break;
        case 429:
          errorMessage = "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast({
      title: "Error creating token",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      success: false,
      message: errorMessage,
    };
  }
};