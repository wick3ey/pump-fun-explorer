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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(uri, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate required fields
      if (!data.image || !data.name) {
        throw new Error('Missing required metadata fields');
      }

      const metadata: TokenMetadata = {
        image: data.image,
        description: data.description || `${symbol} Token on Solana`,
        name: data.name
      };

      // Verify image URL is accessible
      const imageResponse = await fetch(metadata.image, {
        method: 'HEAD',
        signal: controller.signal
      });

      if (!imageResponse.ok) {
        throw new Error('Image URL is not accessible');
      }

      TokenMetadataValidator.cacheMetadata(symbol, metadata);
      return metadata;

    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      TokenMetadataValidator.clearMetadataForToken(symbol);
      return null;
    } finally {
      TokenMetadataValidator.finishProcessing(symbol);
    }
  }
}