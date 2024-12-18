import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { isTokenGraduated } from '@/lib/token/tokenProcessor';

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => void;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  searchTokens: (query: string) => TokenData[];
  getGraduationProgress: (symbol: string) => number;
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

      getGraduationProgress: (symbol: string) => {
        const token = get().tokens.find(t => t.symbol === symbol);
        if (!token) return 0;
        return Math.min((token.marketCap / 90000) * 100, 100);
      },
    }),
    {
      name: 'token-storage',
    }
  )
);