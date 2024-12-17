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

  private static readonly MAX_RETRIES = 5;
  private static readonly RETRY_DELAY = 2000; // 2 seconds between retries
  private static readonly FETCH_DELAY = 1000; // 1 second between different tokens
  private static processingQueue: string[] = [];
  private static isProcessing = false;

  static async fetchMetadata(symbol: string, uri: string): Promise<TokenMetadata | null> {
    try {
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

      let retryCount = 0;
      while (retryCount < this.MAX_RETRIES) {
        try {
          // Layer 3: Attempt to fetch metadata from URI
          console.log(`Attempt ${retryCount + 1} to fetch metadata for ${symbol}`);
          const response = await fetch(uri);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata from ${uri}`);
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

          // Layer 3: Verify the metadata is unique and valid
          if (TokenMetadataValidator.isImageUsed(metadata.image, symbol)) {
            console.log(`Image ${metadata.image} already in use, retrying...`);
            throw new Error('Image already in use');
          }

          // Layer 3: Verify and cache the metadata
          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            console.log(`Successfully fetched and verified metadata for ${symbol}`);
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

      console.error(`Failed to fetch metadata for ${symbol} after ${this.MAX_RETRIES} attempts`);
      throw new Error(`Failed to fetch metadata after ${this.MAX_RETRIES} attempts`);

    } catch (error) {
      console.error('Error in fetchMetadata:', error);
      return null;
    } finally {
      // Remove from queue and release processing lock
      this.processingQueue = this.processingQueue.filter(s => s !== symbol);
      this.isProcessing = false;
      TokenMetadataValidator.finishProcessing(symbol);
      
      // Add delay before processing next token
      await new Promise(resolve => setTimeout(resolve, this.FETCH_DELAY));
    }
  }
}