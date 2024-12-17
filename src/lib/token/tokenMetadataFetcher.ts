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
    },
    'POPCAT': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28741.png",
      description: "The First Cat Coin on Solana 🐱",
      name: "POPCAT"
    },
    'SLERF': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28768.png",
      description: "The Memecoin That Slerf'd 🌊",
      name: "SLERF"
    },
    'BOME': {
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28803.png",
      description: "BOME on Solana 💣",
      name: "BOME"
    }
  };

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata> {
    try {
      console.log(`Fetching metadata for ${symbol} with URI: ${uri}`);

      // Check hardcoded metadata first
      if (this.hardcodedMetadata[symbol]) {
        console.log(`Using hardcoded metadata for ${symbol}`);
        return this.hardcodedMetadata[symbol];
      }

      // Check cache
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        console.log(`Using cached metadata for ${symbol}`);
        const validatedImage = await ImageHandler.validateAndCacheImage(cachedMetadata.image, symbol);
        return { ...cachedMetadata, image: validatedImage };
      }

      if (!uri) {
        console.log(`No URI provided for ${symbol}, using default metadata`);
        return this.getDefaultMetadata(symbol);
      }

      // Extract CID from URI
      const cid = uri.replace(/^https?:\/\/[^/]+\/ipfs\//, '').replace('ipfs://', '');
      console.log(`Extracted CID for ${symbol}: ${cid}`);

      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Attempt ${attempt} to fetch metadata for ${symbol}`);
          const response = await IPFSGateway.fetchFromGateways(cid, attempt);
          const data = await response.json();
          
          // Validate and sanitize image URL
          const sanitizedImageUrl = ImageHandler.sanitizeImageUrl(data.image);
          console.log(`Sanitized image URL for ${symbol}: ${sanitizedImageUrl}`);
          
          const validatedImage = await ImageHandler.validateAndCacheImage(sanitizedImageUrl, symbol);
          console.log(`Validated image URL for ${symbol}: ${validatedImage}`);

          const metadata: TokenMetadata = {
            image: validatedImage,
            description: data.description?.slice(0, 500) || `${symbol} Token on Solana`,
            name: data.name?.slice(0, 100) || symbol
          };

          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            console.log(`Successfully verified metadata for ${symbol}`);
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }

          console.warn(`Invalid metadata for ${symbol}, using default`);
          return this.getDefaultMetadata(symbol);
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt} failed for ${symbol}:`, error);
          
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
      image: `/placeholder.svg`,
      description: `${symbol} Token on Solana`,
      name: symbol
    };
    
    TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
    return defaultMetadata;
  }
}