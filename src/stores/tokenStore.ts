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

          // Strict metadata validation
          if (!TokenMetadataValidator.validateTokenData(token)) {
            console.error('Token validation failed:', token);
            return;
          }

          if (token.contractAddress) {
            tokenWebSocket.subscribeToTokenTrade(token.contractAddress);
          }

          set((state) => {
            const existingTokenIndex = state.tokens.findIndex(t => t.symbol === token.symbol);
            
            if (existingTokenIndex !== -1) {
              // Update existing token while preserving metadata
              const updatedTokens = [...state.tokens];
              updatedTokens[existingTokenIndex] = {
                ...updatedTokens[existingTokenIndex],
                ...token,
                marketCap: token.marketCapUSD || token.marketCap || 0,
                image: updatedTokens[existingTokenIndex].image, // Preserve existing image
              };
              return { tokens: updatedTokens };
            } else {
              // Add new token only if it has valid metadata
              const metadata = TokenMetadataValidator.getCachedMetadata(token.symbol);
              if (!metadata) {
                console.error('Missing metadata for new token:', token.symbol);
                return state;
              }
              
              return {
                tokens: [{
                  ...token,
                  marketCap: token.marketCapUSD || token.marketCap || 0,
                  image: metadata.image,
                  description: metadata.description,
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
        if (!TokenMetadataValidator.validateTokenData({ ...updates, symbol })) {
          console.error('Invalid token update:', updates);
          return;
        }

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
          const validatedTokens = tokens.filter(token => 
            TokenMetadataValidator.validateTokenData(token)
          );
          
          if (validatedTokens.length !== tokens.length) {
            console.log('Some tokens failed validation during market cap update');
          }
          
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