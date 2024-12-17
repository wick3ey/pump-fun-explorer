const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const fetchSolPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=solana&vs_currencies=usd`
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 0;
  }
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