import { Connection, PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';
import { toast } from "@/components/ui/use-toast";
import { uploadMetadataToIPFS } from './ipfsService';
import { getCreateTransaction, sendTransactionWithRetry } from './transactionService';
import { CreateTokenResponse, TokenCreationConfig } from './types';
import { supabase } from "@/integrations/supabase/client";

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

  if (!metadata.pfpImage || !metadata.name || !metadata.symbol) {
    throw new Error("Please provide all required token information");
  }

  if (initialBuyAmount < 0.1) {
    throw new Error("Minimum initial buy amount is 0.1 SOL");
  }

  const connection = new Connection(TRUSTED_RPC_ENDPOINT, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  });

  try {
    // First create the token record in Supabase
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert([{
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        creator_id: wallet.publicKey.toString(),
      }])
      .select()
      .single();

    if (tokenError) {
      throw new Error(`Failed to create token record: ${tokenError.message}`);
    }

    toast({
      title: "Creating Your Token",
      description: "Securely uploading metadata to IPFS...",
    });

    const metadataUri = await uploadMetadataToIPFS(metadata);
    
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
      mint: mint.publicKey,
      metadataUri,
      initialBuyAmount,
    });

    if (!txData || txData.length === 0) {
      throw new Error("Invalid transaction data received");
    }

    const tx = VersionedTransaction.deserialize(txData);
    
    if (!tx.message || !tx.message.recentBlockhash) {
      throw new Error("Invalid transaction structure");
    }

    tx.sign([mint]);
    
    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaction Signed",
      description: "Sending to Solana network securely...",
    });

    const signature = await sendTransactionWithRetry(connection, signedTx);

    // Record the transaction in Supabase
    const { error: txError } = await supabase
      .from('transactions')
      .insert([{
        token_id: tokenData.id,
        user_id: wallet.publicKey.toString(),
        amount: initialBuyAmount,
        price: initialBuyAmount, // Initial price is 1:1
        status: 'completed',
        signature,
      }]);

    if (txError) {
      console.error("Failed to record transaction:", txError);
    }

    // Update the token with contract address
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ contract_address: mint.publicKey.toString() })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error("Failed to update token contract address:", updateError);
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