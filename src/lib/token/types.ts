import { PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  pfpImage: File;
  headerImage: File;
  tokenMode: 'og' | 'doxxed' | 'locked';
  power: string;
}

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
  metadata: {
    name: string;
    symbol: string;
    uri: string;
  };
  metadataUri: string;
  mint: PublicKey;
  initialBuyAmount: number;
  supply: number;
}