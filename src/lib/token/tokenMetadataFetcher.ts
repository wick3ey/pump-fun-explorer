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

  private static defaultImages = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  ];

  static async fetchMetadata(symbol: string, uri: string): Promise<TokenMetadata | null> {
    try {
      if (TokenMetadataValidator.isProcessing(symbol)) {
        console.log('Token already being processed:', symbol);
        return null;
      }

      // Use hardcoded metadata if available
      if (this.hardcodedMetadata[symbol]) {
        console.log('Using hardcoded metadata for:', symbol);
        const metadata = this.hardcodedMetadata[symbol];
        if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
          TokenMetadataValidator.cacheMetadata(symbol, metadata);
          return metadata;
        }
      }

      // Check cache first
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        console.log('Using cached metadata for:', symbol);
        return cachedMetadata;
      }

      TokenMetadataValidator.startProcessing(symbol);

      // Generate deterministic metadata for the token
      const hash = await this.generateHash(symbol);
      const imageIndex = Math.abs(hash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % this.defaultImages.length;
      
      const defaultMetadata: TokenMetadata = {
        image: this.defaultImages[imageIndex],
        description: `${symbol} Token on Solana`,
        name: symbol
      };

      // Verify and cache the metadata
      if (TokenMetadataValidator.verifyMetadata(symbol, defaultMetadata)) {
        TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
        return defaultMetadata;
      }

      return defaultMetadata;

    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      return null;
    } finally {
      TokenMetadataValidator.finishProcessing(symbol);
    }
  }

  private static async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}