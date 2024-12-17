export interface TokenData {
  symbol: string;
  name: string;
  marketCap: number;
  marketCapSol?: number;
  marketCapUSD?: number;
  age: string;
  power: number;
  chain: string;
  isSafeDegen?: boolean;
  totalSupply: number;
  contractAddress?: string;
  image?: string;
  description?: string;
  uri?: string;
  timestamp: number;
}

export interface NewTokenData {
  symbol: string;
  name: string;
  totalSupply: number;
  power?: number;
  contractAddress?: string;
  marketCapSol?: number;
  marketCapUSD?: number;
  image?: string;
  description?: string;
  uri?: string;
}