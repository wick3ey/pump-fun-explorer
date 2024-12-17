import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenData } from '@/types/token';

const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens

interface InitialTransaction {
  solAmount: number;
  timestamp: number;
}

export const calculateMarketCap = (initialTransaction: InitialTransaction | null): number => {
  if (!initialTransaction) return 0;
  
  // Calculate price per token based on initial SOL amount
  const pricePerToken = initialTransaction.solAmount / TOTAL_SUPPLY;
  
  // Current SOL price in USD (this should be fetched from an API in production)
  const solPriceUSD = 100; // Example fixed price, should be dynamic
  
  // Calculate market cap in USD
  return pricePerToken * TOTAL_SUPPLY * solPriceUSD;
};

interface TokenStore {
  tokens: TokenData[];
  addToken: (token: TokenData) => void;
  updateToken: (symbol: string, updates: Partial<TokenData>) => void;
  getInitialTransaction: (symbol: string) => InitialTransaction | null;
  setInitialTransaction: (symbol: string, solAmount: number) => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      addToken: (token) => {
        const initialTransaction = {
          solAmount: token.initialSolAmount || 1, // Default to 1 SOL if not specified
          timestamp: Date.now(),
        };
        
        const marketCap = calculateMarketCap({ 
          solAmount: initialTransaction.solAmount,
          timestamp: initialTransaction.timestamp 
        });

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
      setInitialTransaction: (symbol, solAmount) => {
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.symbol === symbol) {
              const initialTransaction = {
                solAmount,
                timestamp: Date.now(),
              };
              return {
                ...token,
                initialTransaction,
                marketCap: calculateMarketCap(initialTransaction),
              };
            }
            return token;
          })
        }));
      },
    }),
    {
      name: 'token-storage',
    }
  )
);