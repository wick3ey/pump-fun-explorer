export interface TokenData {
  symbol: string;
  name: string;
  marketCap: number;
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
}