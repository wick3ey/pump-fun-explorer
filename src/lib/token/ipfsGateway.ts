export class IPFSGateway {
  private static readonly BACKUP_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://nftstorage.link/ipfs/',
    'https://cf-ipfs.com/ipfs/'
  ];

  static async fetchFromGateways(cid: string, attempt: number): Promise<Response> {
    const errors: Error[] = [];
    const gatewayCount = Math.min(2 + attempt, this.BACKUP_GATEWAYS.length);
    const shuffledGateways = [...this.BACKUP_GATEWAYS]
      .sort(() => Math.random() - 0.5)
      .slice(0, gatewayCount);

    const fetchPromises = shuffledGateways.map(async (gateway) => {
      try {
        const url = `${gateway}${cid}`;
        console.log(`Attempting fetch from gateway ${gateway}, attempt ${attempt}`);
        
        const response = await this.fetchWithTimeout(url, 5000);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
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

  private static async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'no-cors', // Changed to no-cors to handle CORS issues
        headers: {
          'Accept': '*/*'
        }
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}