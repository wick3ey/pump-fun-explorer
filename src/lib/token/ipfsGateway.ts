export class IPFSGateway {
  private static readonly BACKUP_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://cf-ipfs.com/ipfs/',
    'https://nftstorage.link/ipfs/'
  ];

  static async fetchFromGateways(cid: string, attempt: number): Promise<Response> {
    const errors: Error[] = [];
    
    // Use more gateways for later attempts
    const gatewayCount = Math.min(2 + attempt, this.BACKUP_GATEWAYS.length);
    const shuffledGateways = [...this.BACKUP_GATEWAYS]
      .sort(() => Math.random() - 0.5)
      .slice(0, gatewayCount);

    const fetchPromises = shuffledGateways.map(async (gateway) => {
      try {
        const url = `${gateway}${cid}`;
        console.log(`Attempting fetch from gateway ${gateway}, attempt ${attempt}`);
        return await this.fetchWithTimeout(url, 8000 + (attempt * 2000));
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
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`Timeout after ${timeout}ms`));
      }, timeout);
    });

    try {
      const fetchPromise = fetch(url, {
        signal: controller.signal,
        mode: 'cors',
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
}