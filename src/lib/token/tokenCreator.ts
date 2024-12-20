import { Connection, PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';
import { toast } from "@/components/ui/use-toast";
import { uploadMetadataToIPFS } from './ipfsService';
import { getCreateTransaction, sendTransactionWithRetry } from './transactionService';
import { CreateTokenResponse, TokenCreationConfig } from './types';

const TRUSTED_RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const MAX_RETRIES = 3;
const TRANSACTION_TIMEOUT = 60000;

export const createToken = async ({
  metadata,
  initialBuyAmount,
  wallet
}: TokenCreationConfig): Promise<CreateTokenResponse> => {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Please connect your wallet to continue");
  }

  // Validate metadata
  if (!metadata.pfpImage || !metadata.name || !metadata.symbol) {
    throw new Error("Please provide all required token information");
  }

  // Validate initial buy amount
  if (initialBuyAmount < 0.1) {
    throw new Error("Minimum initial buy amount is 0.1 SOL");
  }

  // Create secure connection with retry logic
  const connection = new Connection(TRUSTED_RPC_ENDPOINT, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  });

  try {
    toast({
      title: "Creating Your Token",
      description: "Securely uploading metadata to IPFS...",
    });

    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Generate a new mint keypair with additional entropy
    const entropy = new Uint8Array(32);
    window.crypto.getRandomValues(entropy);
    const mint = Keypair.fromSeed(entropy);

    toast({
      title: "Metadata Secured",
      description: "Preparing secure transaction...",
    });

    const txData = await getCreateTransaction({
      publicKey: wallet.publicKey.toBase58(),
      metadata: {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadataUri,
      },
      metadataUri,
      initialBuyAmount,
      mint: mint.publicKey
    });

    // Verify transaction data before signing
    if (!txData || txData.length === 0) {
      throw new Error("Invalid transaction data received");
    }

    const tx = VersionedTransaction.deserialize(txData);
    
    // Add additional security checks
    if (!tx.message || !tx.message.recentBlockhash) {
      throw new Error("Invalid transaction structure");
    }

    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaction Signed",
      description: "Sending to Solana network securely...",
    });

    const signature = await sendTransactionWithRetry(connection, signedTx);

    // Verify transaction success
    const confirmation = await connection.confirmTransaction(signature);
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    toast({
      title: "Success! 🎉",
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
    
    const errorMessage = error instanceof Error ? error.message : "Failed to create token";

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