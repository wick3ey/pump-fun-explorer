export class SolPriceService {
  private solPriceUSD: number | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  async initialize() {
    await this.updateSolPrice();
    this.startPriceUpdates();
  }

  private async updateSolPrice() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      const data = await response.json();
      this.solPriceUSD = data.solana.usd;
      console.log('SOL price updated:', this.solPriceUSD);
    } catch (error) {
      console.error('Failed to update SOL price:', error);
    }
  }

  private startPriceUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => this.updateSolPrice(), 60000);
  }

  getSolPrice(): number {
    return this.solPriceUSD || 0;
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export const solPriceService = new SolPriceService();