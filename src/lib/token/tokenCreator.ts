import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { toast } from "@/components/ui/use-toast";
import bs58 from "bs58";

export const createToken = async (
  metadata: TokenMetadata,
  initialBuyAmount: number,
  wallet: WalletContextState
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  try {
    // Create form data for IPFS metadata
    const formData = new FormData();
    formData.append("file", metadata.pfpImage);
    formData.append("name", metadata.name);
    formData.append("symbol", metadata.symbol);
    formData.append("description", metadata.description);
    formData.append("twitter", metadata.twitter || "");
    formData.append("telegram", metadata.telegram || "");
    formData.append("website", metadata.website || "");
    formData.append("showName", "true");

    // Upload metadata to IPFS with proper CORS handling
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
      mode: 'cors',
      headers: {
        'Origin': window.location.origin,
      }
    });

    if (!metadataResponse.ok) {
      throw new Error(`IPFS upload failed: ${metadataResponse.statusText}`);
    }

    const metadataResponseJSON = await metadataResponse.json();

    if (!metadataResponseJSON.metadataUri) {
      throw new Error("Failed to get metadata URI from IPFS");
    }

    // Get the create transaction from Pump.fun API
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Origin': window.location.origin,
      },
      mode: 'cors',
      body: JSON.stringify({
        publicKey: wallet.publicKey.toBase58(),
        action: "create",
        tokenMetadata: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadataResponseJSON.metadataUri,
        },
        denominatedInSol: "true",
        amount: initialBuyAmount,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create token: ${errorText || response.statusText}`);
    }

    const data = await response.arrayBuffer();
    if (!data || data.byteLength === 0) {
      throw new Error("Received empty transaction data");
    }

    const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    
    // Sign the transaction
    const signedTx = await wallet.signTransaction(tx);
    if (!signedTx) {
      throw new Error("Failed to sign transaction");
    }

    // Use RPC endpoint from environment variable with fallback
    const connection = new Connection(
      import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
      {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000, // 60 second timeout
      }
    );

    // Send the transaction with retry logic
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
    
    // Provide more specific error messages based on the error type
    let errorMessage = "Failed to create token";
    if (error instanceof Error) {
      if (error.message.includes("IPFS")) {
        errorMessage = "Failed to upload token images. Please try again.";
      } else if (error.message.includes("wallet")) {
        errorMessage = "Please ensure your wallet is connected and try again.";
      } else if (error.message.includes("transaction")) {
        errorMessage = "Transaction failed. Please check your balance and try again.";
      } else {
        errorMessage = error.message;
      }
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

// Helper function to retry failed transactions
async function sendTransactionWithRetry(
  connection: Connection,
  transaction: VersionedTransaction,
  maxRetries = 3
): Promise<string> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const signature = await connection.sendTransaction(transaction);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed: ${confirmation.value.err}`);
      }
      
      return signature;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw new Error(`Failed to send transaction after ${maxRetries} attempts: ${lastError?.message}`);
}