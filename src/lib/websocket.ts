class TokenWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onNewTokenCallback: ((data: any) => void) | null = null;
  private subscribedTokens: Set<string> = new Set();
  private solPriceUSD: number | null = null;
  private metadataCache: Map<string, any> = new Map();
  private pendingTokens: Map<string, any> = new Map();

  constructor() {
    this.connect();
    this.initializeSolPrice();
  }

  private async initializeSolPrice() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      const data = await response.json();
      this.solPriceUSD = data.solana.usd;
      console.log('Initial SOL price:', this.solPriceUSD);

      setInterval(async () => {
        try {
          const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
          );
          const data = await response.json();
          this.solPriceUSD = data.solana.usd;
          console.log('Updated SOL price:', this.solPriceUSD);
        } catch (error) {
          console.error('Failed to update SOL price:', error);
        }
      }, 60000);
    } catch (error) {
      console.error('Failed to initialize SOL price:', error);
    }
  }

  private getTokenMetadata(symbol: string) {
    const metadata: { [key: string]: { pfp: string, description: string } } = {
      'WIF': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/24735.png",
        description: "Friend.tech for Solana 🐕"
      },
      'BONK': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
        description: "The First Solana Dog Coin 🐕"
      },
      'MYRO': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28736.png",
        description: "The Solana Memecoin for the People 🐕"
      },
      'POPCAT': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28741.png",
        description: "The First Cat Coin on Solana 🐱"
      },
      'SLERF': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28768.png",
        description: "The Memecoin That Slerf'd 🌊"
      },
      'BOME': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28803.png",
        description: "BOME on Solana 💣"
      }
    };
    return metadata[symbol] || null;
  }

  private validateTokenData(tokenData: any, metadata: any): boolean {
    if (!tokenData || !metadata) return false;
    if (!tokenData.marketCap || tokenData.marketCap <= 0) return false;
    if (!metadata.image || !metadata.description) return false;
    if (!tokenData.symbol || !tokenData.name) return false;
    return true;
  }

  private async fetchTokenMetadata(uri: string, symbol: string) {
    const hardcodedMetadata = this.getTokenMetadata(symbol);
    if (hardcodedMetadata) {
      console.log('Using hardcoded metadata for:', symbol);
      return {
        image: hardcodedMetadata.pfp,
        description: hardcodedMetadata.description,
        name: symbol
      };
    }

    if (this.metadataCache.has(uri)) {
      console.log('Using cached metadata for:', symbol);
      return this.metadataCache.get(uri);
    }

    try {
      console.log('Fetching metadata for:', symbol, 'URI:', uri);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(uri, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const metadata = await response.json();
      console.log('Successfully fetched metadata for:', symbol, metadata);
      
      const processedMetadata = {
        image: metadata.image || '/placeholder.svg',
        description: metadata.description || `${symbol} Token on Solana`,
        name: metadata.name || symbol
      };
      
      this.metadataCache.set(uri, processedMetadata);
      return processedMetadata;
    } catch (error) {
      console.error('Error fetching metadata for:', symbol, error);
      return null;
    }
  }

  private async processTokenData(parsedData: any) {
    try {
      if (parsedData.marketCapSol !== undefined && this.solPriceUSD) {
        const marketCapUSD = parsedData.marketCapSol * this.solPriceUSD;
        console.log('Market Cap calculation:', {
          marketCapSol: parsedData.marketCapSol,
          solPriceUSD: this.solPriceUSD,
          marketCapUSD
        });

        let metadata = null;
        if (parsedData.uri) {
          metadata = await this.fetchTokenMetadata(parsedData.uri, parsedData.symbol);
        } else {
          const hardcodedMetadata = this.getTokenMetadata(parsedData.symbol);
          if (hardcodedMetadata) {
            metadata = {
              image: hardcodedMetadata.pfp,
              description: hardcodedMetadata.description,
              name: parsedData.symbol
            };
          }
        }

        const tokenData = {
          ...parsedData,
          marketCapUSD,
          marketCap: marketCapUSD,
          transactions: parsedData.transactions || 0,
          holders: parsedData.holders || 0,
          power: parsedData.power || 0,
          chain: "SOL",
          percentageChange: 0,
          age: "new",
          totalSupply: 1_000_000_000,
          image: metadata?.image || '/placeholder.svg',
          description: metadata?.description || `${parsedData.symbol} Token on Solana`,
          name: metadata?.name || parsedData.symbol,
        };

        if (this.validateTokenData(tokenData, metadata)) {
          console.log('Token validated and ready for display:', tokenData);
          if (this.onNewTokenCallback) {
            this.onNewTokenCallback(tokenData);
          }
        } else {
          console.log('Token validation failed:', tokenData);
          this.pendingTokens.set(parsedData.symbol, { data: parsedData, attempts: 0 });
        }
      }
    } catch (error) {
      console.error('Error processing token data:', error);
    }
  }

  private connect() {
    try {
      this.ws = new WebSocket('wss://pumpportal.fun/api/data');
      
      this.ws.onopen = () => {
        console.log('Connected to PumpPortal WebSocket');
        this.reconnectAttempts = 0;
        this.subscribeToNewTokens();
        this.subscribedTokens.forEach(token => this.subscribeToTokenTrade(token));
      };

      this.ws.onmessage = async (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          console.log('Received WebSocket data:', parsedData);
          await this.processTokenData(parsedData);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private subscribeToNewTokens() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: "subscribeNewToken"
      }));
      console.log('Subscribed to new tokens');
    }
  }

  public subscribeToTokenTrade(tokenAddress: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: 'subscribeTokenTrade',
        keys: [tokenAddress]
      }));
      this.subscribedTokens.add(tokenAddress);
      console.log('Subscribed to token trades:', tokenAddress);
    }
  }

  public onNewToken(callback: (data: any) => void) {
    this.onNewTokenCallback = callback;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const tokenWebSocket = new TokenWebSocket();
