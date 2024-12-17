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
          if (!token.marketCap || token.marketCap <= 0) {
            console.log('Skipping token with invalid market cap:', token);
            return;
          }

          if (!token.image || token.image === '/placeholder.svg') {
            console.log('Skipping token with missing image:', token);
            return;
          }

          if (token.contractAddress) {
            tokenWebSocket.subscribeToTokenTrade(token.contractAddress);
          }

          set((state) => {
            const existingTokenIndex = state.tokens.findIndex(t => t.symbol === token.symbol);
            
            if (existingTokenIndex !== -1) {
              const updatedTokens = [...state.tokens];
              updatedTokens[existingTokenIndex] = {
                ...updatedTokens[existingTokenIndex],
                ...token,
                marketCap: token.marketCapUSD || token.marketCap || 0,
              };
              return { tokens: updatedTokens };
            } else {
              return {
                tokens: [{
                  ...token,
                  marketCap: token.marketCapUSD || token.marketCap || 0,
                }, ...state.tokens].slice(0, 100)
              };
            }
          });
          
          console.log('Token added/updated:', token);
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
                  marketCap: updates.marketCapUSD || updates.marketCap || token.marketCap
                } 
              : token
          )
        }));
      },
      updateMarketCaps: async () => {
        try {
          const tokens = get().tokens;
          console.log('Updating market caps for tokens:', tokens);
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