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

    // Upload metadata to IPFS
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    if (!metadataResponse.ok) {
      throw new Error("Failed to upload metadata to IPFS");
    }

    const metadataResponseJSON = await metadataResponse.json();

    // Get the create transaction from Pump.fun API
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        pool: "pump",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create token: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));

    // Sign the transaction
    const signedTx = await wallet.signTransaction(tx);

    // Use RPC endpoint from environment variable
    const connection = new Connection(
      import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
      'confirmed'
    );

    // Send the transaction
    const signature = await connection.sendTransaction(signedTx);

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
    toast({
      title: "Error creating token",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create token",
    };
  }
};