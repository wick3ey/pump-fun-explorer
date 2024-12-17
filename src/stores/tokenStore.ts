import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';
import { fetchSolPrice } from '@/lib/priceUtils';

const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens

interface InitialTransaction {
  solAmount: number;
  timestamp: number;
}

export const calculateMarketCap = async (initialTransaction: InitialTransaction | null): Promise<number> => {
  if (!initialTransaction) return 0;
  
  // Calculate price per token based on initial SOL amount
  const pricePerToken = initialTransaction.solAmount / TOTAL_SUPPLY;
  
  // Get real-time SOL price from CoinGecko
  const solPriceUSD = await fetchSolPrice();
  
  // Calculate market cap in USD
  return pricePerToken * TOTAL_SUPPLY * solPriceUSD;
};

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => void;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  getInitialTransaction: (symbol: string) => InitialTransaction | null;
  setInitialTransaction: (symbol: string, solAmount: number) => void;
  updateMarketCaps: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      addToken: async (token) => {
        const initialTransaction = {
          solAmount: token.initialSolAmount || 1, // Default to 1 SOL if not specified
          timestamp: Date.now(),
        };
        
        const marketCap = await calculateMarketCap(initialTransaction);

        set((state) => ({
          tokens: [{
            ...token,
            marketCap,
            initialTransaction,
          }, ...state.tokens].slice(0, 10)
        }));
      },
      updateToken: (symbol, updates) =>
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.symbol === symbol ? { ...token, ...updates } : token
          )
        })),
      getInitialTransaction: (symbol) => {
        const token = get().tokens.find(t => t.symbol === symbol);
        return token?.initialTransaction || null;
      },
      setInitialTransaction: async (symbol, solAmount) => {
        const initialTransaction = {
          solAmount,
          timestamp: Date.now(),
        };
        
        const marketCap = await calculateMarketCap(initialTransaction);
        
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.symbol === symbol) {
              return {
                ...token,
                initialTransaction,
                marketCap,
              };
            }
            return token;
          })
        }));
      },
      updateMarketCaps: async () => {
        const tokens = get().tokens;
        const updatedTokens = await Promise.all(
          tokens.map(async (token) => {
            const marketCap = await calculateMarketCap(token.initialTransaction || null);
            return { ...token, marketCap };
          })
        );
        
        set({ tokens: updatedTokens });
      },
    }),
    {
      name: 'token-storage',
    }
  )
);