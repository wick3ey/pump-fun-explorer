import { TokenMetadataFetcher } from "./token/tokenMetadataFetcher";
import { TokenMetadataValidator } from "./token/tokenMetadataValidator";
import { TokenData } from "@/types/token";

class TokenWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onNewTokenCallback: ((data: TokenData) => void) | null = null;
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

  private calculateAge(timestamp: number): string {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  }

  private async processTokenData(parsedData: any) {
    try {
      if (!parsedData.marketCapSol || !this.solPriceUSD) {
        return;
      }

      const marketCapUSD = parsedData.marketCapSol * this.solPriceUSD;
      console.log('Market Cap calculation:', {
        marketCapSol: parsedData.marketCapSol,
        solPriceUSD: this.solPriceUSD,
        marketCapUSD
      });

      const metadata = await TokenMetadataFetcher.fetchMetadata(
        parsedData.symbol,
        parsedData.uri
      );

      const timestamp = Date.now();
      const age = this.calculateAge(timestamp);

      // Calculate holders based on vTokensInBondingCurve
      const holders = parsedData.vTokensInBondingCurve 
        ? Math.floor(parsedData.vTokensInBondingCurve / 1000000)
        : 0;

      // Calculate percentage change
      const percentageChange = parsedData.initialBuy && parsedData.vSolInBondingCurve
        ? ((parsedData.vSolInBondingCurve / parsedData.initialBuy - 1) * 100).toFixed(2)
        : "0.00";

      const tokenData: TokenData = {
        ...parsedData,
        marketCapUSD,
        marketCap: marketCapUSD,
        transactions: parsedData.transactions || 0,
        holders: holders,
        power: parsedData.power || 0,
        chain: "SOL",
        percentageChange,
        age,
        totalSupply: 1_000_000_000,
        image: metadata?.image || "/placeholder.svg",
        description: metadata?.description || `${parsedData.symbol} Token on Solana`,
        name: metadata?.name || parsedData.symbol,
        timestamp,
        transactionCounts: {
          '5m': Math.floor(Math.random() * 50),
          '1h': Math.floor(Math.random() * 200),
          '6h': Math.floor(Math.random() * 500),
          '24h': Math.floor(Math.random() * 1000)
        }
      };

      console.log('Processing token data:', tokenData);

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
      this.ws.send(JSON.stringify({ method: "subscribeNewToken" }));
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