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

  static async fetchMetadata(symbol: string, uri: string): Promise<TokenMetadata | null> {
    try {
      // Layer 1: Check if token is already being processed
      if (TokenMetadataValidator.isProcessing(symbol)) {
        console.log('Token already being processed:', symbol);
        return null;
      }

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

      TokenMetadataValidator.startProcessing(symbol);

      try {
        // Layer 3: Attempt to fetch metadata from URI
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata from ${uri}`);
        }

        const data = await response.json();
        const metadata: TokenMetadata = {
          image: data.image || await this.generateUniqueImage(symbol),
          description: data.description || `${symbol} Token on Solana`,
          name: data.name || symbol
        };

        // Layer 3: Verify the image is unique and valid
        if (TokenMetadataValidator.isImageUsed(metadata.image, symbol)) {
          metadata.image = await this.generateUniqueImage(symbol);
        }

        // Layer 3: Verify and cache the metadata
        if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
          TokenMetadataValidator.cacheMetadata(symbol, metadata);
          return metadata;
        }

        return metadata;
      } catch (error) {
        console.error('Error fetching metadata from URI:', error);
        // Layer 3: Fallback to generating unique metadata
        const fallbackMetadata: TokenMetadata = {
          image: await this.generateUniqueImage(symbol),
          description: `${symbol} Token on Solana`,
          name: symbol
        };

        if (TokenMetadataValidator.verifyMetadata(symbol, fallbackMetadata)) {
          TokenMetadataValidator.cacheMetadata(symbol, fallbackMetadata);
          return fallbackMetadata;
        }

        return fallbackMetadata;
      }
    } catch (error) {
      console.error('Error in fetchMetadata:', error);
      return null;
    } finally {
      TokenMetadataValidator.finishProcessing(symbol);
    }
  }

  private static async generateUniqueImage(symbol: string): Promise<string> {
    const defaultImages = [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      "https://images.unsplash.com/photo-1639762681057-408e52192e55",
      "https://images.unsplash.com/photo-1639762681286-39def2c7930c",
      "https://images.unsplash.com/photo-1639762681253-225ca2f2c666",
      "https://images.unsplash.com/photo-1639762681634-fb4c3f69c3aa",
      "https://images.unsplash.com/photo-1639762681767-06f7c4d8c73e"
    ];

    const hash = await this.generateHash(symbol);
    let imageIndex = Math.abs(hash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaultImages.length;
    let selectedImage = defaultImages[imageIndex];

    // Keep trying different indices until we find an unused image
    while (TokenMetadataValidator.isImageUsed(selectedImage, symbol)) {
      imageIndex = (imageIndex + 1) % defaultImages.length;
      selectedImage = defaultImages[imageIndex];
    }

    return selectedImage;
  }

  private static async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}