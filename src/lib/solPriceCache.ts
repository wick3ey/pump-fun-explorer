let cachedSolPrice: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60000; // 1 minute in milliseconds

export const getCachedSolPrice = async (): Promise<number> => {
  const now = Date.now();
  
  // If we have a cached price and it's less than 1 minute old, return it
  if (cachedSolPrice && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedSolPrice;
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    const data = await response.json();
    cachedSolPrice = data.solana.usd;
    lastFetchTime = now;
    return cachedSolPrice;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    // Return last cached price if available, otherwise return 0
    return cachedSolPrice || 0;
  }
};