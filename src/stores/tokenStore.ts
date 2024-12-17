import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { getCachedSolPrice } from '@/lib/solPriceCache';
import { tokenWebSocket } from '@/lib/websocket';

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => Promise<void>;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  updateMarketCaps: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      addToken: async (token) => {
        try {
          const solPrice = await getCachedSolPrice();
          
          // Subscribe to token trades
          if (token.contractAddress) {
            tokenWebSocket.subscribeToTokenTrade(token.contractAddress);
          }

          set((state) => ({
            tokens: [{
              ...token,
              marketCap: token.marketCapSol ? token.marketCapSol * solPrice : 0,
              totalSupply: token.totalSupply || 1_000_000_000,
            }, ...state.tokens].slice(0, 10)
          }));
        } catch (error) {
          console.error('Error adding token:', error);
        }
      },
      updateToken: (symbol, updates) =>
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol ? { ...token, ...updates } : token
          )
        })),
      updateMarketCaps: async () => {
        try {
          const solPrice = await getCachedSolPrice();
          const tokens = get().tokens;
          
          const updatedTokens = tokens.map(token => ({
            ...token,
            marketCap: token.marketCapSol ? token.marketCapSol * solPrice : token.marketCap
          }));
          
          set({ tokens: updatedTokens });
        } catch (error) {
          console.error('Error updating market caps:', error);
        }
      },
    }),
    {
      name: 'token-storage',
    }
  )
);