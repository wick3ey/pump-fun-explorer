import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { toast } from "@/components/ui/use-toast";

export const createToken = async (
  metadata: TokenMetadata,
  initialBuyAmount: number,
  wallet: WalletContextState
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    
    // Create new mint
    const mint = await createMint(
      connection,
      wallet.publicKey,
      wallet.publicKey,
      null,
      9
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.publicKey,
      mint,
      wallet.publicKey
    );

    // Mint 1 million tokens to token account
    await mintTo(
      connection,
      wallet.publicKey,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      1000000 * Math.pow(10, 9)
    );

    // Store metadata on-chain (simplified version)
    const transaction = new Transaction().add(
      // Add your metadata instruction here
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");

    return {
      success: true,
      message: "Token created successfully!",
      mint: mint.toBase58(),
      tokenAccount: tokenAccount.address.toBase58()
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
      message: error instanceof Error ? error.message : "Failed to create token"
    };
  }
};