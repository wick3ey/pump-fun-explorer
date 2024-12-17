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

      // Try to fetch from direct URI first
      try {
        const response = await fetch(uri, {
          mode: 'no-cors',
          headers: { 'Accept': '*/*' }
        });
        if (response.ok) {
          const data = await response.json();
          const metadata = this.processMetadataResponse(data, symbol);
          if (metadata) return metadata;
        }
      } catch (error) {
        console.warn(`Failed to fetch from direct URI: ${error}`);
      }

      // Extract CID and try IPFS gateways
      const cid = this.extractCID(uri);
      if (!cid) {
        return this.getDefaultMetadata(symbol);
      }

      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Attempt ${attempt} to fetch metadata for ${symbol}`);
          const response = await IPFSGateway.fetchFromGateways(cid, attempt);
          const data = await response.json();
          
          const metadata = this.processMetadataResponse(data, symbol);
          if (metadata) return metadata;

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

  private static extractCID(uri: string): string | null {
    try {
      const ipfsMatch = uri.match(/ipfs\/([a-zA-Z0-9]+)/);
      if (ipfsMatch) return ipfsMatch[1];
      
      const ipfsUriMatch = uri.match(/^ipfs:\/\/([a-zA-Z0-9]+)/);
      if (ipfsUriMatch) return ipfsUriMatch[1];
      
      return null;
    } catch {
      return null;
    }
  }

  private static processMetadataResponse(data: any, symbol: string): TokenMetadata | null {
    try {
      if (!data) return null;

      const sanitizedImageUrl = ImageHandler.sanitizeImageUrl(data.image);
      const metadata: TokenMetadata = {
        image: sanitizedImageUrl,
        description: data.description?.slice(0, 500) || `${symbol} Token on Solana`,
        name: data.name?.slice(0, 100) || symbol
      };

      if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
        TokenMetadataValidator.cacheMetadata(symbol, metadata);
        return metadata;
      }

      return null;
    } catch {
      return null;
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