import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { fetchSolPrice, calculateTokenMarketCap } from '@/lib/priceUtils';

const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens

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
          const solPrice = await fetchSolPrice();
          const marketCap = await calculateTokenMarketCap(
            TOTAL_SUPPLY,
            token.initialSolAmount || 1,
            solPrice
          );

          set((state) => ({
            tokens: [{
              ...token,
              marketCap,
              totalSupply: TOTAL_SUPPLY,
              lastTransactionSolAmount: token.initialSolAmount || 1
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
          const solPrice = await fetchSolPrice();
          const tokens = get().tokens;
          
          const updatedTokens = await Promise.all(
            tokens.map(async (token) => {
              const marketCap = await calculateTokenMarketCap(
                TOTAL_SUPPLY,
                token.lastTransactionSolAmount || token.initialSolAmount || 1,
                solPrice
              );
              return { ...token, marketCap };
            })
          );
          
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