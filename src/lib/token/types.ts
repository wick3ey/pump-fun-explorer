import { TokenMetadata } from "@/types/token";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface CreateTokenResponse {
  success: boolean;
  message: string;
  signature?: string;
  txUrl?: string;
}

export interface TokenCreationConfig {
  metadata: TokenMetadata;
  initialBuyAmount: number;
  wallet: WalletContextState;
}

export interface TransactionConfig {
  publicKey: string;
  metadata: TokenMetadata;
  metadataUri: string;
  initialBuyAmount: number;
}