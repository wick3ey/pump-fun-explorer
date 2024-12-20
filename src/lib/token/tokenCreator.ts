import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { toast } from "@/components/ui/use-toast";
import { uploadMetadataToIPFS } from './ipfsService';
import { getCreateTransaction, sendTransactionWithRetry } from './transactionService';
import { CreateTokenResponse, TokenCreationConfig } from './types';
import { supabase } from "@/integrations/supabase/client";

const TRUSTED_RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const MAX_RETRIES = 3;
const TRANSACTION_TIMEOUT = 60000;
const MIN_SOL_AMOUNT = 0.1;
const MAX_SOL_AMOUNT = 100;

export const validateInitialBuy = (amount: number): string | null => {
  if (isNaN(amount) || amount < MIN_SOL_AMOUNT) {
    return `Minimum allowed amount is ${MIN_SOL_AMOUNT} SOL`;
  }
  if (amount > MAX_SOL_AMOUNT) {
    return `Maximum allowed amount is ${MAX_SOL_AMOUNT} SOL`;
  }
  return null;
};

export const createToken = async ({
  metadata,
  initialBuyAmount,
  wallet
}: TokenCreationConfig): Promise<CreateTokenResponse> => {
  console.log("Starting token creation process");
  
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Please connect your wallet to continue");
  }

  const validationError = validateInitialBuy(initialBuyAmount);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!metadata.pfpImage || !metadata.name || !metadata.symbol) {
    throw new Error("Please fill in all required token information");
  }

  const connection = new Connection(TRUSTED_RPC_ENDPOINT, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  });

  try {
    console.log("Creating token with metadata:", metadata);

    // Get user's auth ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    // Create token record in Supabase
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert([{
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        creator_id: user.id,
        contract_address: null,
      }])
      .select()
      .single();

    if (tokenError) {
      console.error("Token creation error:", tokenError);
      throw new Error(`Could not create token: ${tokenError.message}`);
    }

    toast({
      title: "Creating your token",
      description: "Uploading metadata to IPFS...",
    });

    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log("Metadata uploaded to IPFS:", metadataUri);
    
    // Generate a new keypair for the mint account
    const entropy = new Uint8Array(32);
    window.crypto.getRandomValues(entropy);
    const mintKeypair = Keypair.fromSeed(entropy);

    toast({
      title: "Metadata secured",
      description: "Preparing secure transaction...",
    });

    const txData = await getCreateTransaction({
      publicKey: wallet.publicKey.toBase58(),
      metadata: {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadataUri,
      },
      mint: mintKeypair.publicKey,
      metadataUri,
      initialBuyAmount,
    });

    const tx = VersionedTransaction.deserialize(txData);
    console.log("Transaction data received, deserializing...");
    
    console.log("Signing transaction with mint account...");
    
    console.log("Getting wallet signature...");
    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaction signed",
      description: "Sending to Solana network securely...",
    });

    console.log("Sending transaction to network...");
    const signature = await sendTransactionWithRetry(connection, signedTx, mintKeypair);

    // Update token with contract address
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ 
        contract_address: mintKeypair.publicKey.toString(),
      })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error("Could not update token contract address:", updateError);
    }

    // Record initial transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        token_id: tokenData.id,
        user_id: user.id,
        amount: initialBuyAmount,
        price: initialBuyAmount,
        status: 'completed',
        signature,
      });

    if (txError) {
      console.error("Could not record transaction:", txError);
    }

    toast({
      title: "Success! 🎉",
      description: `Token created! View on Solscan: https://solscan.io/tx/${signature}`,
    });

    return {
      success: true,
      message: "Token created successfully!",
      signature,
      txUrl: `https://solscan.io/tx/${signature}`,
    };

  } catch (error) {
    console.error("Error creating token:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Could not create token";

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