import { solPriceService } from './solPriceService';
import { TokenData } from '@/types/token';

export const processTokenData = async (parsedData: any): Promise<TokenData | null> => {
  try {
    const solPrice = solPriceService.getSolPrice();
    if (!solPrice) return null;

    const marketCapUSD = parsedData.marketCapSol * solPrice;

    return {
      ...parsedData,
      marketCapUSD,
      marketCap: marketCapUSD,
      transactions: 0,
      holders: 0,
      power: 0,
      chain: "SOL",
      percentageChange: 0,
      age: "new",
      totalSupply: 1_000_000_000,
      image: '/placeholder.svg',
      description: '',
      name: parsedData.symbol || '',
    };
  } catch (error) {
    console.error('Error processing token data:', error);
    return null;
  }
};