import { Connection, PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';
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
    return `Minsta tillåtna belopp är ${MIN_SOL_AMOUNT} SOL`;
  }
  if (amount > MAX_SOL_AMOUNT) {
    return `Högsta tillåtna belopp är ${MAX_SOL_AMOUNT} SOL`;
  }
  return null;
};

export const calculateTokenSupply = (initialBuyAmount: number): number => {
  const baseSupply = 1000000;
  const multiplier = Math.sqrt(initialBuyAmount * 100);
  return Math.floor(baseSupply * multiplier);
};

export const createToken = async ({
  metadata,
  initialBuyAmount,
  wallet
}: TokenCreationConfig): Promise<CreateTokenResponse> => {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Vänligen anslut din plånbok för att fortsätta");
  }

  const validationError = validateInitialBuy(initialBuyAmount);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!metadata.pfpImage || !metadata.name || !metadata.symbol) {
    throw new Error("Vänligen fyll i all nödvändig information om token");
  }

  const connection = new Connection(TRUSTED_RPC_ENDPOINT, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  });

  try {
    // Get user's auth ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error("Användaren är inte autentiserad");
    }

    // Create token record in Supabase with auth user ID
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert([{
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        creator_id: user.id, // Use auth user ID instead of wallet public key
        contract_address: null, // Will be updated after token creation
      }])
      .select()
      .single();

    if (tokenError) {
      console.error("Token creation error:", tokenError);
      throw new Error(`Kunde inte skapa token: ${tokenError.message}`);
    }

    toast({
      title: "Skapar din token",
      description: "Laddar upp metadata till IPFS...",
    });

    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    const entropy = new Uint8Array(32);
    window.crypto.getRandomValues(entropy);
    const mint = Keypair.fromSeed(entropy);

    const supply = calculateTokenSupply(initialBuyAmount);

    toast({
      title: "Metadata säkrad",
      description: "Förbereder säker transaktion...",
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
      supply,
    });

    if (!txData || txData.length === 0) {
      throw new Error("Ogiltig transaktionsdata mottagen");
    }

    const tx = VersionedTransaction.deserialize(txData);
    
    if (!tx.message || !tx.message.recentBlockhash) {
      throw new Error("Ogiltig transaktionsstruktur");
    }

    tx.sign([mint]);
    
    const signedTx = await wallet.signTransaction(tx);

    toast({
      title: "Transaktion signerad",
      description: "Skickar till Solana-nätverket säkert...",
    });

    const signature = await sendTransactionWithRetry(connection, signedTx);

    // Update token with contract address
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ 
        contract_address: mint.publicKey.toString(),
      })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error("Kunde inte uppdatera token kontraktadress:", updateError);
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
      console.error("Kunde inte registrera transaktion:", txError);
    }

    toast({
      title: "Framgång! 🎉",
      description: `Token skapad! Se på Solscan: https://solscan.io/tx/${signature}`,
    });

    return {
      success: true,
      message: "Token skapad framgångsrikt!",
      signature,
      txUrl: `https://solscan.io/tx/${signature}`,
    };

  } catch (error) {
    console.error("Fel vid skapande av token:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Kunde inte skapa token";

    toast({
      title: "Fel vid skapande av token",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      success: false,
      message: errorMessage,
    };
  }
};