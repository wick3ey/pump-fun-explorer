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

      if (this.hardcodedMetadata[symbol]) {
        console.log('Using hardcoded metadata for:', symbol);
        return this.hardcodedMetadata[symbol];
      }

      const cachedMetadata = TokenMetadataValidator.getCachedMetadata(symbol);
      if (cachedMetadata) {
        console.log('Using cached metadata for:', symbol);
        return cachedMetadata;
      }

      TokenMetadataValidator.startProcessing(symbol);

      if (!uri) {
        throw new Error('Missing URI');
      }

      // Extract IPFS hash if it's an IPFS URI
      const ipfsHash = uri.replace('ipfs://', '').replace('https://ipfs.io/ipfs/', '');
      
      // Try different IPFS gateways
      for (const gateway of this.ipfsGateways) {
        try {
          const response = await this.fetchWithTimeout(`${gateway}${ipfsHash}`, 5000);
          if (response.ok) {
            const data = await response.json();
            
            if (!data.image || !data.name) {
              console.log('Missing required metadata fields for:', symbol);
              continue;
            }

            // Convert IPFS image URL to use working gateway
            const imageHash = data.image.replace('ipfs://', '').replace('https://ipfs.io/ipfs/', '');
            const imageUrl = `${gateway}${imageHash}`;

            // Verify image is accessible
            try {
              const imageResponse = await this.fetchWithTimeout(imageUrl, 3000);
              if (!imageResponse.ok) {
                console.log('Image not accessible, trying next gateway');
                continue;
              }
            } catch (error) {
              console.log('Image fetch failed, trying next gateway');
              continue;
            }

            const metadata: TokenMetadata = {
              image: imageUrl,
              description: data.description || `${symbol} Token on Solana`,
              name: data.name
            };

            if (TokenMetadataValidator.isImageUsed(imageUrl, symbol)) {
              console.log('Image already used by another token:', symbol);
              continue;
            }

            TokenMetadataValidator.cacheMetadata(symbol, metadata);
            return metadata;
          }
        } catch (error) {
          console.log(`Gateway ${gateway} failed, trying next one`);
          continue;
        }
      }

      throw new Error('All IPFS gateways failed');

    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      TokenMetadataValidator.clearMetadataForToken(symbol);
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