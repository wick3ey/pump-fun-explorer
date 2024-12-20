import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
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
    
    // Create a new keypair for the mint authority
    const mintAuthority = Keypair.generate();
    
    // Create new mint with the generated keypair
    const mint = await createMint(
      connection,
      mintAuthority, // Use the keypair as the payer
      mintAuthority.publicKey, // Mint authority
      mintAuthority.publicKey, // Freeze authority
      9 // Decimals
    );

    // Get the token account of the wallet address, and if it does not exist, create it
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, // Use the keypair as the payer
      mint,
      wallet.publicKey
    );

    // Mint tokens to the token account
    await mintTo(
      connection,
      mintAuthority, // Use the keypair as the payer
      mint,
      tokenAccount.address,
      mintAuthority, // Use the keypair as the mint authority
      1000000 * Math.pow(10, 9) // Amount to mint
    );

    // Create a transaction to transfer ownership of the mint to the wallet
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: mintAuthority.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0, // Symbolic transfer
      })
    );

    // Sign and send the transaction
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = wallet.publicKey;
    
    const signedTx = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
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