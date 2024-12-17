export interface NewTokenData {
  symbol: string;
  name: string;
  marketCap?: number;
  transactions?: number;
  holders?: number;
  power?: number;
  timestamp: number;
  contractAddress: string;
}

export interface TokenTradeData {
  tokenAddress: string;
  price: number;
  amount: number;
  timestamp: number;
  buyer: string;
  seller: string;
}