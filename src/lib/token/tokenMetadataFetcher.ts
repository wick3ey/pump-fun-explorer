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
  private static readonly FETCH_DELAY = 1000;
  private static processingQueue: string[] = [];
  private static isProcessing = false;

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata | null> {
    try {
      if (!symbol) {
        console.error('No symbol provided for metadata fetch');
        return null;
      }

      // Layer 1: Check if token is already being processed
      if (TokenMetadataValidator.isProcessing(symbol)) {
        console.log('Token already being processed:', symbol);
        return null;
      }

      // Add to processing queue if not already in it
      if (!this.processingQueue.includes(symbol)) {
        this.processingQueue.push(symbol);
      }

      // Wait if another token is being processed
      while (this.isProcessing && this.processingQueue[0] !== symbol) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      this.isProcessing = true;
      TokenMetadataValidator.startProcessing(symbol);

      // Layer 2: Use hardcoded metadata if available
      if (this.hardcodedMetadata[symbol]) {
        console.log('Using hardcoded metadata for:', symbol);
        const metadata = this.hardcodedMetadata[symbol];
        if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
          TokenMetadataValidator.cacheMetadata(symbol, metadata);
          return metadata;
        }
      }

      // Layer 2: Check cache first
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        console.log('Using cached metadata for:', symbol);
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
          console.log(`Attempt ${retryCount + 1} to fetch metadata for ${symbol} from ${uri}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
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
          
          if (!data.image || !data.name) {
            throw new Error('Invalid metadata format - missing required fields');
          }

          const metadata: TokenMetadata = {
            image: data.image,
            description: data.description || `${symbol} Token on Solana`,
            name: data.name
          };

          if (TokenMetadataValidator.isImageUsed(metadata.image, symbol)) {
            console.log(`Image ${metadata.image} already in use, using default`);
            metadata.image = "/placeholder.svg";
          }

          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }

          throw new Error('Metadata verification failed');
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount < this.MAX_RETRIES) {
            console.log(`Waiting ${this.RETRY_DELAY}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }

      // If all retries fail, return default metadata
      console.log(`Using default metadata for ${symbol} after ${this.MAX_RETRIES} failed attempts`);
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
    } finally {
      this.processingQueue = this.processingQueue.filter(s => s !== symbol);
      this.isProcessing = false;
      TokenMetadataValidator.finishProcessing(symbol);
      await new Promise(resolve => setTimeout(resolve, this.FETCH_DELAY));
    }
  }
}