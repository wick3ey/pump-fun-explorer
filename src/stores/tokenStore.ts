import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';

const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens

export const calculateMarketCap = (price: number): number => {
  return price * TOTAL_SUPPLY;
};

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => void;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      tokens: [],
      addToken: (token) => 
        set((state) => ({
          tokens: [token, ...state.tokens].slice(0, 10)
        })),
      updateToken: (symbol, updates) =>
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol ? { ...token, ...updates } : token
          )
        })),
    }),
    {
      name: 'token-storage',
    }
  )
);