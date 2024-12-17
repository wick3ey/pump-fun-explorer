export class ImageHandler {
  private static imageCache = new Map<string, string>();
  private static validationCache = new Map<string, boolean>();
  
  static async validateAndCacheImage(imageUrl: string, symbol: string): Promise<string> {
    try {
      console.log(`Validating image for ${symbol}: ${imageUrl}`);
      
      // Check cache first
      const cachedImage = this.imageCache.get(symbol);
      if (cachedImage) {
        console.log(`Using cached image for ${symbol}`);
        return cachedImage;
      }

      // If URL is empty or invalid, return placeholder
      if (!imageUrl || !this.isValidUrl(imageUrl)) {
        console.log(`Invalid URL for ${symbol}, using placeholder`);
        return `/placeholder.svg`;
      }

      // Try to validate the image
      const isValid = await this.isValidImage(imageUrl);
      if (isValid) {
        console.log(`Valid image found for ${symbol}`);
        this.imageCache.set(symbol, imageUrl);
        return imageUrl;
      }

      console.log(`Image validation failed for ${symbol}, using placeholder`);
      return `/placeholder.svg`;
    } catch (error) {
      console.warn(`Failed to validate/cache image for ${symbol}:`, error);
      return `/placeholder.svg`;
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static async isValidImage(url: string): Promise<boolean> {
    try {
      const cached = this.validationCache.get(url);
      if (cached !== undefined) return cached;

      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        headers: { 'Accept': '*/*' }
      });
      
      const isValid = response.ok || response.status === 0; // Consider status 0 as valid for no-cors
      this.validationCache.set(url, isValid);
      return isValid;
    } catch {
      return false;
    }
  }

  static sanitizeImageUrl(url?: string): string {
    if (!url) return `/placeholder.svg`;
    
    if (url.startsWith('ipfs://')) {
      return `https://w3s.link/ipfs/${url.replace('ipfs://', '')}`;
    }
    
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    
    return url;
  }

  static clearCache(symbol?: string) {
    if (symbol) {
      this.imageCache.delete(symbol);
      this.validationCache.clear();
    } else {
      this.imageCache.clear();
      this.validationCache.clear();
    }
  }
}