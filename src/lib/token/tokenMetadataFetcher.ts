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
    },
    'POPCAT': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28741.png",
      description: "The First Cat Coin on Solana 🐱",
      name: "POPCAT"
    }
  };

  static async fetchMetadata(symbol: string, uri: string): Promise<TokenMetadata | null> {
    try {
      // Check if we're already processing this token
      if (TokenMetadataValidator.isProcessing(symbol)) {
        console.log('Token already being processed:', symbol);
        return null;
      }

      // Check hardcoded metadata first
      if (this.hardcodedMetadata[symbol]) {
        console.log('Using hardcoded metadata for:', symbol);
        return this.hardcodedMetadata[symbol];
      }

      // Check cache
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        console.log('Using cached metadata for:', symbol);
        return cachedMetadata;
      }

      TokenMetadataValidator.startProcessing(symbol);

      // Validate URI format
      if (!uri || !uri.startsWith('https://')) {
        throw new Error('Invalid URI format');
      }

      // Set up fetch with timeout and retry logic
      const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      // Try fetching metadata with retries
      let attempts = 0;
      const maxAttempts = 3;
      let lastError: Error | null = null;

      while (attempts < maxAttempts) {
        try {
          const response = await fetchWithTimeout(uri, {}, 5000);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (!data.image || !data.name) {
            throw new Error('Missing required metadata fields');
          }

          // Validate image URL
          const imageUrl = data.image.startsWith('ipfs://')
            ? `https://ipfs.io/ipfs/${data.image.slice(7)}`
            : data.image;

          // Verify image is accessible
          const imageResponse = await fetchWithTimeout(imageUrl, { method: 'HEAD' }, 5000);
          
          if (!imageResponse.ok) {
            throw new Error('Image URL is not accessible');
          }

          const metadata: TokenMetadata = {
            image: imageUrl,
            description: data.description || `${symbol} Token on Solana`,
            name: data.name
          };

          // Verify this image isn't already used
          if (TokenMetadataValidator.isImageUsed(imageUrl, symbol)) {
            throw new Error('Image already used by another token');
          }

          TokenMetadataValidator.cacheMetadata(symbol, metadata);
          return metadata;

        } catch (error) {
          lastError = error as Error;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
          continue;
        }
      }

      throw lastError || new Error('Failed to fetch metadata after retries');

    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      TokenMetadataValidator.clearMetadataForToken(symbol);
      return null;
    } finally {
      TokenMetadataValidator.finishProcessing(symbol);
    }
  }
}