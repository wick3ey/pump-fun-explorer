import { TokenMetadataValidator, TokenMetadata } from "./tokenMetadataValidator";

export class TokenMetadataFetcher {
  private static hardcodedMetadata: Record<string, TokenMetadata> = {
    'WIF': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/24735.png",
      description: "Friend.tech for Solana 🐕",
      name: "WIF"
    },
    'BONK': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
      description: "The First Solana Dog Coin 🐕",
      name: "BONK"
    },
    'MYRO': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28736.png",
      description: "The Solana Memecoin for the People 🐕",
      name: "MYRO"
    }
  };

  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000;
  private static readonly FETCH_TIMEOUT = 5000;
  private static processingQueue: string[] = [];
  private static isProcessing = false;

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata | null> {
    try {
      if (!symbol) {
        console.error('No symbol provided for metadata fetch');
        return null;
      }

      // Layer 1: Check hardcoded metadata
      if (this.hardcodedMetadata[symbol]) {
        return this.hardcodedMetadata[symbol];
      }

      // Layer 2: Check cache
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        return cachedMetadata;
      }

      // If no URI provided, return default metadata
      if (!uri) {
        const defaultMetadata: TokenMetadata = {
          image: "/placeholder.svg",
          description: `${symbol} Token on Solana`,
          name: symbol
        };
        TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
        return defaultMetadata;
      }

      let retryCount = 0;
      while (retryCount < this.MAX_RETRIES) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT);

          const response = await fetch(uri, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          const metadata: TokenMetadata = {
            image: data.image || "/placeholder.svg",
            description: data.description || `${symbol} Token on Solana`,
            name: data.name || symbol
          };

          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }

          throw new Error('Metadata verification failed');
        } catch (error) {
          retryCount++;
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }

      // If all retries fail, return default metadata
      const defaultMetadata: TokenMetadata = {
        image: "/placeholder.svg",
        description: `${symbol} Token on Solana`,
        name: symbol
      };
      TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
      return defaultMetadata;

    } catch (error) {
      console.error('Error in fetchMetadata:', error);
      return null;
    }
  }
}