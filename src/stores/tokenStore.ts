import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { fetchTokenMetadata } from '@/lib/solana/tokenMetadata';

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => Promise<void>;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  updateMarketCaps: () => Promise<void>;
  searchTokens: (query: string) => TokenData[];
  filterTokensByMarketCap: (order: 'asc' | 'desc') => TokenData[];
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      
      addToken: async (token) => {
        try {
          const metadata = await fetchTokenMetadata(token.contractAddress);
          const timestamp = token.timestamp || Date.now();
          
          const enrichedToken = {
            ...token,
            name: metadata.name || token.name,
            symbol: metadata.symbol || token.symbol,
            image: metadata.image,
            description: metadata.description,
            marketCap: token.marketCapUSD || token.marketCap || 0,
            timestamp,
          };
          
          set((state) => {
            const existingTokenIndex = state.tokens.findIndex(t => t.symbol === token.symbol);
            
            if (existingTokenIndex !== -1) {
              const updatedTokens = [...state.tokens];
              updatedTokens[existingTokenIndex] = enrichedToken;
              return { tokens: updatedTokens };
            } else {
              return {
                tokens: [enrichedToken, ...state.tokens].slice(0, 100)
              };
            }
          });
        } catch (error) {
          console.error('Error adding token:', error);
          set((state) => ({
            tokens: [{
              ...token,
              marketCap: token.marketCapUSD || token.marketCap || 0,
              timestamp: token.timestamp || Date.now(),
            }, ...state.tokens].slice(0, 100)
          }));
        }
      },

      updateToken: (symbol, updates) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol 
              ? { 
                  ...token, 
                  ...updates,
                  marketCap: updates.marketCapUSD || updates.marketCap || token.marketCap
                } 
              : token
          )
        }));
      },

      updateMarketCaps: async () => {
        try {
          const tokens = get().tokens;
          set({ tokens: [...tokens] });
        } catch (error) {
          console.error('Error updating market caps:', error);
        }
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

      filterTokensByMarketCap: (order: 'asc' | 'desc') => {
        const tokens = get().tokens;
        return [...tokens].sort((a, b) => {
          const marketCapA = a.marketCap || 0;
          const marketCapB = b.marketCap || 0;
          return order === 'asc' ? marketCapA - marketCapB : marketCapB - marketCapA;
        });
      },
    }),
    {
      name: 'token-storage',
    }
  )
);
