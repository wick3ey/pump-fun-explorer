import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
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
          if (token.contractAddress) {
            tokenWebSocket.subscribeToTokenTrade(token.contractAddress);
          }

          set((state) => ({
            tokens: [{
              ...token,
              marketCap: token.marketCapUSD || 0,
              totalSupply: token.totalSupply || 1_000_000_000,
            }, ...state.tokens].slice(0, 10)
          }));
        } catch (error) {
          console.error('Error adding token:', error);
        }
      },
      updateToken: (symbol, updates) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol 
              ? { 
                  ...token, 
                  ...updates,
                  marketCap: updates.marketCapUSD || token.marketCap,
                  lastPrice: updates.price || token.lastPrice
                } 
              : token
          )
        }));
      },
      updateMarketCaps: async () => {
        try {
          const tokens = get().tokens;
          set({ tokens });
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