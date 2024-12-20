import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "@/components/ui/use-toast";
import bs58 from 'bs58';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  image?: File;
}

export async function createToken(
  metadata: TokenMetadata,
  amount: number,
  wallet: ReturnType<typeof useWallet>
) {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    // Upload metadata and image to IPFS
    const formData = new FormData();
    if (metadata.image) {
      formData.append("file", metadata.image);
    }
    formData.append("name", metadata.name);
    formData.append("symbol", metadata.symbol);
    formData.append("description", metadata.description);
    if (metadata.twitter) formData.append("twitter", metadata.twitter);
    if (metadata.telegram) formData.append("telegram", metadata.telegram);
    if (metadata.website) formData.append("website", metadata.website);
    formData.append("showName", "true");

    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    if (!metadataResponse.ok) {
      throw new Error('Failed to upload metadata');
    }

    const metadataResponseJSON = await metadataResponse.json();

    // Get the create transaction
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "publicKey": wallet.publicKey.toBase58(),
        "action": "create",
        "tokenMetadata": {
          name: metadataResponseJSON.metadata.name,
          symbol: metadataResponseJSON.metadata.symbol,
          uri: metadataResponseJSON.metadataUri
        },
        "denominatedInSol": "true",
        "amount": amount,
        "slippage": 10,
        "priorityFee": 0.0005,
        "pool": "pump"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create token transaction');
    }

    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));

    // Sign and send transaction
    const signedTx = await wallet.signTransaction(tx);
    const connection = new Connection(process.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com");
    const signature = await connection.sendTransaction(signedTx);

    return {
      signature,
      success: true,
      message: `Transaction sent: https://solscan.io/tx/${signature}`
    };

  } catch (error) {
    console.error('Token creation error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}