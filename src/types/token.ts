export interface TokenData {
  symbol: string;
  name: string;
  marketCap: number;
  marketCapSol?: number;
  marketCapUSD?: number;
  age: string;
  transactions: number;
  holders: number;
  power: number;
  chain: string;
  percentageChange: number;
  isSafeDegen?: boolean;
  initialSolAmount?: number;
  lastTransactionSolAmount?: number;
  totalSupply: number;
  contractAddress?: string;
  lastPrice?: number;
  price?: number;
  image?: string;
  description?: string;
  uri?: string;
}

export interface NewTokenData {
  symbol: string;
  name: string;
  price: number;
  totalSupply: number;
  transactions?: number;
  holders?: number;
  power?: number;
  initialSolAmount?: number;
  contractAddress?: string;
  marketCapSol?: number;
  marketCapUSD?: number;
  image?: string;
  description?: string;
  uri?: string;
}