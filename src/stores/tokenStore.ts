import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { tokenWebSocket } from '@/lib/websocket';
import { TokenMetadataValidator } from '@/lib/token/tokenMetadataValidator';

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

          const isValid = TokenMetadataValidator.validateTokenData(token);
          console.log(`Token ${token.symbol} validation result:`, isValid);

          if (token.contractAddress) {
            tokenWebSocket.subscribeToTokenTrade(token.contractAddress);
          }

          set((state) => {
            const existingTokenIndex = state.tokens.findIndex(t => t.symbol === token.symbol);
            const timestamp = token.timestamp || Date.now();
            
            if (existingTokenIndex !== -1) {
              const updatedTokens = [...state.tokens];
              updatedTokens[existingTokenIndex] = {
                ...updatedTokens[existingTokenIndex],
                ...token,
                marketCap: token.marketCapUSD || token.marketCap || 0,
                timestamp,
              };
              return { tokens: updatedTokens };
            } else {
              return {
                tokens: [{
                  ...token,
                  marketCap: token.marketCapUSD || token.marketCap || 0,
                  image: token.image || "/placeholder.svg",
                  description: token.description || `${token.symbol} Token on Solana`,
                  timestamp,
                  transactionCounts: {
                    '5m': 0,
                    '1h': 0,
                    '6h': 0,
                    '24h': 0,
                  }
                }, ...state.tokens].slice(0, 100)
              };
            }
          });
          
          console.log('Token added/updated successfully:', token);
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
          const validatedTokens = tokens.filter(token => token.marketCap > 0);
          set({ tokens: validatedTokens });
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