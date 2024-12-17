import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
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
          const isValid = TokenMetadataValidator.validateTokenData(token);
          console.log(`Token ${token.symbol} validation result:`, isValid);

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
          set({ tokens: [...tokens] });
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