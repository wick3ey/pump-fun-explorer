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

  private static ipfsGateways = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://dweb.link/ipfs/'
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

      // Create default metadata if URI is missing
      if (!uri) {
        const defaultMetadata: TokenMetadata = {
          image: "/placeholder.svg",
          description: `${symbol} Token on Solana`,
          name: symbol
        };
        TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
        return defaultMetadata;
      }

      // Extract IPFS hash
      const ipfsHash = uri.replace('ipfs://', '').replace('https://ipfs.io/ipfs/', '');
      
      // Try different IPFS gateways
      for (const gateway of this.ipfsGateways) {
        try {
          const response = await this.fetchWithTimeout(`${gateway}${ipfsHash}`, 3000);
          if (response.ok) {
            const data = await response.json();
            
            if (!data.image || !data.name) {
              continue;
            }

            const metadata: TokenMetadata = {
              image: data.image.startsWith('http') ? data.image : `${gateway}${data.image.replace('ipfs://', '')}`,
              description: data.description || `${symbol} Token on Solana`,
              name: data.name
            };

            // Verify metadata before caching
            if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
              TokenMetadataValidator.cacheMetadata(symbol, metadata);
              return metadata;
            } else {
              console.warn(`Invalid metadata received for ${symbol}, trying next gateway`);
              continue;
            }
          }
        } catch (error) {
          console.log(`Gateway ${gateway} failed for ${symbol}, trying next one`);
          continue;
        }
      }

      // If all gateways fail, use default metadata
      const defaultMetadata: TokenMetadata = {
        image: "/placeholder.svg",
        description: `${symbol} Token on Solana`,
        name: symbol
      };
      TokenMetadataValidator.cacheMetadata(symbol, defaultMetadata);
      return defaultMetadata;

    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      return null;
    } finally {
      TokenMetadataValidator.finishProcessing(symbol);
    }
  }

  private static async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; TokenMetadataFetcher/1.0)'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}