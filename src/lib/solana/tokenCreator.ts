import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from "@/components/ui/use-toast";

export const createToken = async (
  connection: Connection,
  payer: Keypair,
  decimals: number = 9
): Promise<{ token: Token; mint: PublicKey }> => {
  try {
    const mint = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      decimals,
      TOKEN_PROGRAM_ID
    );

    toast({
      title: "Token Created",
      description: "Successfully created new token on Solana",
    });

    return { token: mint, mint: mint.publicKey };
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