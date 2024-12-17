import { getCachedSolPrice } from './solPriceCache';

export const fetchSolPrice = async (): Promise<number> => {
  return getCachedSolPrice();
};

export const calculateTokenMarketCap = async (
  totalSupply: number,
  lastTransactionSolAmount: number,
  solPriceUSD: number
): Promise<number> => {
  // Calculate price per token based on the last transaction
  const pricePerTokenInSol = lastTransactionSolAmount / totalSupply;
  
  // Calculate market cap in USD
  const marketCapUSD = pricePerTokenInSol * totalSupply * solPriceUSD;
  
  return marketCapUSD;
};