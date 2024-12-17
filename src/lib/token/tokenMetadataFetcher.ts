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
  private static readonly FETCH_TIMEOUT = 10000; // Increased timeout
  private static readonly BACKUP_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/'
  ];

  private static async fetchWithTimeout(url: string, timeout: number, attempt: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async tryFetchFromGateways(cid: string, attempt: number): Promise<Response> {
    const errors: Error[] = [];

    for (const gateway of this.BACKUP_GATEWAYS) {
      try {
        const url = `${gateway}${cid}`;
        console.log(`Attempting fetch from gateway ${gateway}, attempt ${attempt}`);
        const response = await this.fetchWithTimeout(url, this.FETCH_TIMEOUT, attempt);
        return response;
      } catch (error) {
        errors.push(error as Error);
        console.warn(`Failed to fetch from ${gateway}:`, error);
        continue;
      }
    }

    throw new Error(`All gateways failed: ${errors.map(e => e.message).join(', ')}`);
  }

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata> {
    try {
      if (!symbol) {
        console.error('No symbol provided for metadata fetch');
        return this.getDefaultMetadata(symbol);
      }

      // Layer 1: Check hardcoded metadata
      if (this.hardcodedMetadata[symbol]) {
        return this.hardcodedMetadata[symbol];
      }

      // Layer 2: Check cache
      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        return cachedMetadata;
      }

      // If no URI provided, return default metadata
      if (!uri) {
        return this.getDefaultMetadata(symbol);
      }

      // Extract CID if it's an IPFS URI
      const cid = uri.replace('https://ipfs.io/ipfs/', '');
      
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
        try {
          const response = await this.tryFetchFromGateways(cid, attempt);
          const data = await response.json();
          
          const metadata: TokenMetadata = {
            image: data.image || "/placeholder.svg",
            description: data.description || `${symbol} Token on Solana`,
            name: data.name || symbol
          };

          if (TokenMetadataValidator.verifyMetadata(symbol, metadata)) {
            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }

          throw new Error('Metadata verification failed');
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt} failed:`, error);
          
          if (attempt < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
          }
        }
      }

      console.error('All fetch attempts failed:', lastError);
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