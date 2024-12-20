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
    const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending tokens');
    }

    const data: DexScreenerResponse = await response.json();
    
    // Sort by market cap and get top 50
    return data.pairs
      .filter(pair => pair.marketCap > 0)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 50);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch trending tokens. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};