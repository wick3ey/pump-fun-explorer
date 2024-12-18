import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import { toast } from "@/components/ui/use-toast";

export const createToken = async (
  connection: Connection,
  payer: Keypair,
  decimals: number = 9
): Promise<{ mint: PublicKey }> => {
  try {
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      decimals
    );

    toast({
      title: "Token Created",
      description: "Successfully created new token on Solana",
    });

    return { mint };
  } catch (error) {
    console.error('Error creating token:', error);
    toast({
      title: "Error",
      description: "Failed to create token",
      variant: "destructive",
    });
    throw error;
  }
};

export const calculateMarketCap = (supply: number, price: number): number => {
  return supply * price;
};

export const GRADUATION_THRESHOLD = 90000; // $90k in USD

export const shouldGraduateToRaydium = (marketCap: number): boolean => {
  return marketCap >= GRADUATION_THRESHOLD;
};