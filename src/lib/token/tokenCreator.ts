import { Connection, PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';
import { toast } from "@/components/ui/use-toast";
import { uploadMetadataToIPFS } from './ipfsService';
import { getCreateTransaction, sendTransactionWithRetry } from './transactionService';
import { CreateTokenResponse, TokenCreationConfig } from './types';

export const createToken = async ({
  metadata,
  initialBuyAmount,
  wallet
}: TokenCreationConfig): Promise<CreateTokenResponse> => {
  if (!wallet.connected) {
    throw new Error("Wallet not connected");
  }

  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not properly initialized");
  }

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
    toast({
      title: "Creating Token",
      description: "Uploading metadata to IPFS...",
    });

    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Generate a new mint keypair for the token
    const mint = new Keypair();

    toast({
      title: "Metadata Uploaded",
      description: "Preparing transaction...",
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

    const tx = VersionedTransaction.deserialize(txData);
    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaction Signed",
      description: "Sending to network...",
    });

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