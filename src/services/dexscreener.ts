import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TokenRow } from "@/integrations/supabase/types";

export interface DexToken {
  chainId: string;
  pairAddress: string;
  baseToken: {
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
  power?: number;
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexToken[];
}

export const fetchTrendingTokens = async (): Promise<DexToken[]> => {
  try {
    console.log('Fetching trending tokens based on boost...');
    
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('*')
      .order('power', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    console.log('Fetched tokens:', tokens);

    // Transform the tokens into the expected DexToken format
    const formattedTokens: DexToken[] = (tokens as TokenRow[]).map(token => ({
      chainId: 'solana',
      pairAddress: token.contract_address || '',
      baseToken: {
        address: token.contract_address || '',
        name: token.name,
        symbol: token.symbol,
      },
      priceUsd: '0',
      volume: {
        h24: 0,
        h1: 0,
      },
      liquidity: {
        usd: 0,
      },
      marketCap: Number(token.market_cap) || 0,
      info: {
        imageUrl: `/placeholder.svg`,
      },
      power: token.power || 0,
    }));

    return formattedTokens;
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