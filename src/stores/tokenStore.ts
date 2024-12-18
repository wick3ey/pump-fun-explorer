import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => void;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  searchTokens: (query: string) => TokenData[];
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      
      addToken: (token) => {
        set((state) => ({
          tokens: [token, ...state.tokens].slice(0, 100)
        }));
      },

      updateToken: (symbol, updates) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol ? { ...token, ...updates } : token
          )
        }));
      },

      searchTokens: (query: string) => {
        const tokens = get().tokens;
        if (!query) return tokens;

        const searchLower = query.toLowerCase();
        return tokens.filter(token => {
          const symbolMatch = token.symbol?.toLowerCase()?.includes(searchLower) || false;
          const nameMatch = token.name?.toLowerCase()?.includes(searchLower) || false;
          const addressMatch = token.contractAddress?.toLowerCase()?.includes(searchLower) || false;
          return symbolMatch || nameMatch || addressMatch;
        });
      },
    }),
    {
      name: 'token-storage',
    }
  )
);