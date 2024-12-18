import { TokenData } from "@/types/token";

class TokenWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onNewTokenCallback: ((data: TokenData) => void) | null = null;
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
      const response = await fetch(uri);
      const metadata = await response.json();
      return {
        image: metadata.image || '',
        description: metadata.description || '',
        name: metadata.name || ''
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }

  private async processTokenData(parsedData: any) {
    try {
      const marketCapUSD = (parsedData.marketCapSol || 0) * (this.solPriceUSD || 0);
      let metadata = null;
      
      if (parsedData.uri) {
        metadata = await this.fetchTokenMetadata(parsedData.uri);
      }

      const tokenData: TokenData = {
        ...parsedData,
        marketCapUSD,
        marketCap: marketCapUSD,
        power: parsedData.power || 0,
        chain: "SOL",
        age: "new",
        totalSupply: 1_000_000_000,
        name: metadata?.name || parsedData.symbol,
        timestamp: Date.now(),
        contractAddress: parsedData.mint,
        image: metadata?.image || "/placeholder.svg",
        description: metadata?.description || `${parsedData.symbol} Token on Solana`
      };

      if (this.onNewTokenCallback) {
        this.onNewTokenCallback(tokenData);
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
      this.ws.send(JSON.stringify({ method: "subscribeNewToken" }));
      console.log('Subscribed to new tokens');
    }
  }

  public onNewToken(callback: (data: TokenData) => void) {
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