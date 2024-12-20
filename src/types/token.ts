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

export interface TokenData {
  symbol: string;
  name: string;
  marketCap?: number;
  age?: string;
  power?: number;
  chain: string;
  isSafeDegen: boolean;
  totalSupply?: number;
  contractAddress?: string;
  image?: string;
  description: string;
  timestamp: number;
}