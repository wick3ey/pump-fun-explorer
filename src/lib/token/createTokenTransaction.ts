import { VersionedTransaction, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TokenMetadata } from '@/types/token';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PUMP_PORTAL_API = 'https://pumpportal.fun/api';
const PUMP_API = 'https://pump.fun/api';
const TRUSTED_RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";

interface CreateTokenResponse {
  success: boolean;
  message: string;
  signature?: string;
  txUrl?: string;
}

async function uploadMetadataToIPFS(metadata: TokenMetadata): Promise<{ metadataUri: string }> {
  const formData = new FormData();
  formData.append("file", metadata.pfpImage);
  formData.append("name", metadata.name);
  formData.append("symbol", metadata.symbol);
  formData.append("description", metadata.description);
  formData.append("twitter", metadata.twitter || "");
  formData.append("telegram", metadata.telegram || "");
  formData.append("website", metadata.website || "");
  formData.append("showName", "true");

  console.log("Uploading metadata to IPFS...");
  const response = await fetch(`${PUMP_API}/ipfs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    console.error("IPFS upload failed:", response.status, response.statusText);
    throw new Error("Failed to upload metadata to IPFS");
  }

  return response.json();
}

async function getCreateTransaction(
  publicKey: string,
  mintKeypair: Keypair,
  metadata: any,
  initialBuyAmount: number
): Promise<Uint8Array> {
  console.log("Getting create transaction...");
  const response = await fetch(`${PUMP_PORTAL_API}/trade-local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      publicKey,
      action: "create",
      tokenMetadata: {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.metadataUri
      },
      mint: mintKeypair.publicKey.toBase58(),
      denominatedInSol: "true",
      amount: initialBuyAmount,
      slippage: 10,
      priorityFee: 0.0005,
      pool: "pump"
    })
  });

  if (!response.ok) {
    console.error("Create transaction failed:", response.status, response.statusText);
    throw new Error(`Failed to get create transaction: ${response.statusText}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

export async function createToken(
  metadata: TokenMetadata,
  initialBuyAmount: number,
  wallet: any
): Promise<CreateTokenResponse> {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(TRUSTED_RPC_ENDPOINT, {
    commitment: 'confirmed',
  });

  try {
    // Get user's auth ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    toast({
      title: "Creating your token",
      description: "Uploading metadata to IPFS...",
    });

    // Generate mint keypair
    const mintKeypair = Keypair.generate();

    // Upload metadata to IPFS
    const ipfsResponse = await uploadMetadataToIPFS(metadata);
    console.log("Metadata uploaded to IPFS:", ipfsResponse);

    // Create token record in Supabase
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert([{
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        creator_id: user.id,
        contract_address: mintKeypair.publicKey.toString(),
      }])
      .select()
      .single();

    if (tokenError) {
      throw new Error(`Database error: ${tokenError.message}`);
    }

    // Get transaction data
    const txData = await getCreateTransaction(
      wallet.publicKey.toBase58(),
      mintKeypair,
      { ...metadata, metadataUri: ipfsResponse.metadataUri },
      initialBuyAmount
    );

    // Deserialize and sign transaction
    const tx = VersionedTransaction.deserialize(txData);
    tx.sign([mintKeypair]);
    const signedTx = await wallet.signTransaction(tx);

    // Send transaction
    const signature = await connection.sendTransaction(signedTx);
    console.log("Transaction sent:", signature);

    // Record transaction
    await supabase
      .from('transactions')
      .insert({
        token_id: tokenData.id,
        user_id: user.id,
        amount: initialBuyAmount,
        price: initialBuyAmount,
        status: 'completed',
        signature,
      });

    return {
      success: true,
      message: "Token created successfully!",
      signature,
      txUrl: `https://solscan.io/tx/${signature}`,
    };

  } catch (error) {
    console.error("Error creating token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
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
}