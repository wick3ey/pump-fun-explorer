import { TokenMetadataValidator, TokenMetadata } from "./tokenMetadataValidator";
import { ImageHandler } from "./imageHandler";
import { IPFSGateway } from "./ipfsGateway";

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

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata> {
    try {
      if (!symbol) {
        console.error('No symbol provided for metadata fetch');
        return this.getDefaultMetadata(symbol);
      }

      // Check hardcoded metadata first
      if (this.hardcodedMetadata[symbol]) {
        return this.hardcodedMetadata[symbol];
      }

      // Check cache
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        const validatedImage = await ImageHandler.validateAndCacheImage(cachedMetadata.image, symbol);
        return { ...cachedMetadata, image: validatedImage };
      }

      if (!uri) {
        return this.getDefaultMetadata(symbol);
      }

      const cid = uri.replace(/^https?:\/\/[^/]+\/ipfs\//, '').replace('ipfs://', '');
      
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await IPFSGateway.fetchFromGateways(cid, attempt);
          const data = await response.json();
          
          const sanitizedImageUrl = ImageHandler.sanitizeImageUrl(data.image);
          const validatedImage = await ImageHandler.validateAndCacheImage(sanitizedImageUrl, symbol);

          const metadata: TokenMetadata = {
            image: validatedImage,
            description: data.description?.slice(0, 500) || `${symbol} Token on Solana`,
            name: data.name?.slice(0, 100) || symbol
          };

          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }

          console.warn(`Invalid metadata for ${symbol}, using default`);
          return this.getDefaultMetadata(symbol);
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt} failed:`, error);
          
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }
      }

      console.error(`All fetch attempts failed for ${symbol}:`, lastError);
      return this.getDefaultMetadata(symbol);

    } catch (error) {
      console.error('Error in fetchMetadata:', error);
      return this.getDefaultMetadata(symbol);
    }
  }

  private static getDefaultMetadata(symbol: string): TokenMetadata {
    const defaultMetadata: TokenMetadata = {
      image: "/placeholder.svg",
      description: `${symbol} Token on Solana`,
      name: symbol
    };
    TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
    return defaultMetadata;
  }
}