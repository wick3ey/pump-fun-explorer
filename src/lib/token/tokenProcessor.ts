import { fetchTokenMetadata } from './tokenMetadataService';
import { solPriceService } from './solPriceService';
import { TokenData } from '@/types/token';

export const processTokenData = async (parsedData: any): Promise<TokenData | null> => {
  try {
    const solPrice = solPriceService.getSolPrice();
    if (!solPrice) return null;

    const marketCapUSD = parsedData.marketCapSol * solPrice;
    let metadata = {
      image: '/placeholder.svg',
      description: `${parsedData.symbol} Token on Solana`,
      name: parsedData.symbol
    };

    if (parsedData.uri) {
      try {
        const fetchedMetadata = await fetchTokenMetadata(parsedData.uri);
        metadata = fetchedMetadata;
      } catch (error) {
        console.log('Using fallback metadata due to fetch error');
      }
    }

    return {
      ...parsedData,
      marketCapUSD,
      marketCap: marketCapUSD,
      transactions: parsedData.transactions || 0,
      holders: parsedData.holders || 0,
      power: parsedData.power || 0,
      chain: "SOL",
      percentageChange: 0,
      age: "new",
      totalSupply: 1_000_000_000,
      image: metadata.image,
      description: metadata.description,
      name: metadata.name || parsedData.symbol,
    };
  } catch (error) {
    console.error('Error processing token data:', error);
    return null;
  }
};