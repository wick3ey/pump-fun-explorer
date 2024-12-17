export class ImageHandler {
  private static imageCache = new Map<string, string>();
  private static validationCache = new Map<string, boolean>();
  
  static async validateAndCacheImage(imageUrl: string, symbol: string): Promise<string> {
    try {
      // Check cache first
      const cachedImage = this.imageCache.get(symbol);
      if (cachedImage) {
        return cachedImage;
      }

      // If URL is empty or invalid, return placeholder
      if (!imageUrl || !this.isValidUrl(imageUrl)) {
        return "/placeholder.svg";
      }

      // Try to validate the image
      const isValid = await this.isValidImage(imageUrl);
      if (isValid) {
        this.imageCache.set(symbol, imageUrl);
        return imageUrl;
      }

      return "/placeholder.svg";
    } catch (error) {
      console.warn(`Failed to validate/cache image for ${symbol}:`, error);
      return "/placeholder.svg";
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

      const response = await fetch(url, { method: 'HEAD' });
      const isValid = response.ok && response.headers.get('content-type')?.startsWith('image/');
      
      this.validationCache.set(url, isValid);
      return isValid;
    } catch {
      return false;
    }
  }

  static sanitizeImageUrl(url?: string): string {
    if (!url) return "/placeholder.svg";
    
    if (url.startsWith('ipfs://')) {
      return `https://cloudflare-ipfs.com/ipfs/${url.replace('ipfs://', '')}`;
    }
    
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    
    return url;
  }

  static clearCache(symbol?: string) {
    if (symbol) {
      this.imageCache.delete(symbol);
    } else {
      this.imageCache.clear();
      this.validationCache.clear();
    }
  }
}