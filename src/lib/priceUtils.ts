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