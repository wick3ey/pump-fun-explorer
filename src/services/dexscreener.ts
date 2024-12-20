import { toast } from "@/components/ui/use-toast";

export interface DexToken {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume: {
    h24: number;
    h1: number;
  };
  liquidity: {
    usd: number;
  };
  marketCap: number;
  info?: {
    imageUrl?: string;
  };
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexToken[];
}

export const fetchTrendingTokens = async (): Promise<DexToken[]> => {
  try {
    // Fetch Solana tokens with high volume
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana/SOL', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending tokens');
    }

    const data: DexScreenerResponse = await response.json();
    
    // Filter for valid tokens and sort by 1h volume
    const solanaTokens = data.pairs
      .filter(pair => 
        pair.chainId.toLowerCase() === 'solana' && 
        pair.baseToken.name && 
        pair.baseToken.symbol &&
        pair.volume?.h1 > 0
      )
      .sort((a, b) => (b.volume?.h1 || 0) - (a.volume?.h1 || 0))
      .slice(0, 50);

    return solanaTokens;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    toast({
      title: "Error",
      description: "Failed to fetch trending tokens. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};