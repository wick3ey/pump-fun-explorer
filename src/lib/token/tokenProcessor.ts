import { TokenData } from '@/types/token';

const GRADUATION_MARKET_CAP = 90000; // $90k graduation threshold

export const processTokenData = async (tokenData: Partial<TokenData>): Promise<TokenData | null> => {
  if (!tokenData) return null;

  return {
    symbol: tokenData.symbol || '',
    name: tokenData.name || '',
    marketCap: tokenData.marketCap || 0,
    age: tokenData.age || '0d',
    power: tokenData.power || 0,
    chain: 'Solana',
    isSafeDegen: tokenData.isSafeDegen || false,
    totalSupply: tokenData.totalSupply || 0,
    contractAddress: tokenData.contractAddress || '',
    image: '/placeholder.svg',
    description: tokenData.description || '',
    timestamp: Date.now(),
  };
};

export const isTokenGraduated = (marketCap: number): boolean => {
  return marketCap >= GRADUATION_MARKET_CAP;
};