import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { toast } from "@/components/ui/use-toast";
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

const calculateTotalCost = (initialBuyAmount: number, power: string): number => {
  const powerCosts: { [key: string]: number } = {
    "0": 0,
    "100": 0.7,
    "500": 1.5,
    "1000": 3.5
  };
  
  return initialBuyAmount + (powerCosts[power] || 0);
};

export const createToken = async (
  metadata: TokenMetadata,
  initialBuyAmount: number,
  wallet: WalletContextState
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  try {
    // Use environment variable for RPC endpoint
    const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com");
    
    // Calculate total cost including power boost
    const totalCost = calculateTotalCost(initialBuyAmount, metadata.power || "0");
    
    // Create transaction for the initial payment
    const paymentTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: Keypair.generate().publicKey, // Replace with your project's wallet
        lamports: totalCost * LAMPORTS_PER_SOL
      })
    );

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    paymentTransaction.recentBlockhash = blockhash;
    paymentTransaction.feePayer = wallet.publicKey;

    // Request wallet signature
    const signedTx = await wallet.signTransaction(paymentTransaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(signature, "confirmed");

    // Create mint authority
    const mintAuthority = Keypair.generate();
    
    // Create new mint
    const mint = await createMint(
      connection,
      mintAuthority,
      mintAuthority.publicKey,
      mintAuthority.publicKey,
      9
    );

    // Create token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      mint,
      wallet.publicKey
    );

    // Mint initial supply
    await mintTo(
      connection,
      mintAuthority,
      mint,
      tokenAccount.address,
      mintAuthority,
      1000000 * Math.pow(10, 9)
    );

    // Transfer ownership
    const transferOwnershipTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: mintAuthority.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0
      })
    );

    transferOwnershipTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transferOwnershipTx.feePayer = wallet.publicKey;
    
    const signedTransferTx = await wallet.signTransaction(transferOwnershipTx);
    const transferSignature = await connection.sendRawTransaction(signedTransferTx.serialize());
    await connection.confirmTransaction(transferSignature, "confirmed");

    toast({
      title: "Success!",
      description: "Token created successfully",
    });

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