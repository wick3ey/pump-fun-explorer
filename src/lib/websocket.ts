class TokenWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onNewTokenCallback: ((data: any) => void) | null = null;
  private subscribedTokens: Set<string> = new Set();
  private solPriceUSD: number | null = null;

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
        } catch (error) {
          console.error('Failed to update SOL price:', error);
        }
      }, 60000);
    } catch (error) {
      console.error('Failed to initialize SOL price:', error);
    }
  }

  private async fetchTokenMetadata(uri: string) {
    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

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
      return {
        image: metadata.image || '/placeholder.svg',
        description: metadata.description || '',
        name: metadata.name || ''
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return {
        image: '/placeholder.svg',
        description: '',
        name: ''
      };
    }
  }

  private async processTokenData(parsedData: any) {
    try {
      if (!this.solPriceUSD) return;

      const marketCapUSD = parsedData.marketCapSol * this.solPriceUSD;
      let metadata = {
        image: '/placeholder.svg',
        description: `${parsedData.symbol} Token on Solana`,
        name: parsedData.symbol
      };

      if (parsedData.uri) {
        const fetchedMetadata = await this.fetchTokenMetadata(parsedData.uri);
        if (fetchedMetadata) {
          metadata = fetchedMetadata;
        }
      }

      return {
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
        image: metadata.image,
        description: metadata.description,
        name: metadata.name || parsedData.symbol,
      };
    } catch (error) {
      console.error('Error processing token data:', error);
      return null;
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
          
          if (parsedData.marketCapSol !== undefined) {
            const tokenData = await this.processTokenData(parsedData);
            if (tokenData && this.onNewTokenCallback) {
              this.onNewTokenCallback(tokenData);
            }
          }
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