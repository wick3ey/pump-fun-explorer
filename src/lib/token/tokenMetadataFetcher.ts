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
  private static readonly RETRY_DELAY = 1000;
  private static readonly FETCH_TIMEOUT = 8000;
  private static readonly BACKUP_GATEWAYS = [
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.ipfs.io/ipfs/'
  ];

  private static imageCache = new Map<string, string>();

  private static async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`Timeout after ${timeout}ms`));
      }, timeout);
    });

    try {
      const fetchPromise = fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.warn(`Fetch failed for ${url}:`, error);
      throw error;
    }
  }

  private static async tryFetchFromGateways(cid: string, attempt: number): Promise<Response> {
    const errors: Error[] = [];
    const shuffledGateways = [...this.BACKUP_GATEWAYS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const fetchPromises = shuffledGateways.map(async (gateway) => {
      try {
        const url = `${gateway}${cid}`;
        console.log(`Attempting fetch from gateway ${gateway}, attempt ${attempt}`);
        return await this.fetchWithTimeout(url, this.FETCH_TIMEOUT);
      } catch (error) {
        errors.push(error as Error);
        console.warn(`Failed to fetch from ${gateway}:`, error);
        return null;
      }
    });

    const responses = await Promise.all(fetchPromises);
    const successfulResponse = responses.find(response => response !== null);

    if (successfulResponse) {
      return successfulResponse;
    }

    throw new Error(`All gateways failed: ${errors.map(e => e.message).join(', ')}`);
  }

  private static async validateAndCacheImage(imageUrl: string, symbol: string): Promise<string> {
    try {
      const cachedImage = this.imageCache.get(symbol);
      if (cachedImage) {
        return cachedImage;
      }

      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        this.imageCache.set(symbol, imageUrl);
        return imageUrl;
      }
      throw new Error('Invalid image URL');
    } catch (error) {
      console.warn(`Failed to validate image for ${symbol}:`, error);
      return "/placeholder.svg";
    }
  }

  static async fetchMetadata(symbol: string, uri?: string): Promise<TokenMetadata> {
    try {
      if (!symbol) {
        console.error('No symbol provided for metadata fetch');
        return this.getDefaultMetadata(symbol);
      }

      if (this.hardcodedMetadata[symbol]) {
        return this.hardcodedMetadata[symbol];
      }

      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        const validatedImage = await this.validateAndCacheImage(cachedMetadata.image, symbol);
        return { ...cachedMetadata, image: validatedImage };
      }

      if (!uri) {
        return this.getDefaultMetadata(symbol);
      }

      const cid = uri.replace(/^https?:\/\/[^/]+\/ipfs\//, '').replace('ipfs://', '');
      
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
        try {
          const response = await this.tryFetchFromGateways(cid, attempt);
          const data = await response.json();
          
          const validatedImage = await this.validateAndCacheImage(
            this.sanitizeImageUrl(data.image),
            symbol
          );

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
          
          if (attempt < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
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

  private static sanitizeImageUrl(url?: string): string {
    if (!url) return "/placeholder.svg";
    
    if (url.startsWith('ipfs://')) {
      return `https://cloudflare-ipfs.com/ipfs/${url.replace('ipfs://', '')}`;
    }
    
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    
    return url;
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