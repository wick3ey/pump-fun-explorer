export interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

export class TokenMetadataValidator {
  private static metadataCache = new Map<string, TokenMetadata>();
  private static processingTokens = new Set<string>();
  private static usedImages = new Map<string, string>();
  private static validationQueue = new Map<string, number>();
  private static MAX_VALIDATION_ATTEMPTS = 3;

  static isProcessing(symbol: string): boolean {
    return this.processingTokens.has(symbol);
  }

  static startProcessing(symbol: string): void {
    this.processingTokens.add(symbol);
    this.validationQueue.set(symbol, (this.validationQueue.get(symbol) || 0) + 1);
  }

  static finishProcessing(symbol: string): void {
    this.processingTokens.delete(symbol);
  }

  static getCachedMetadata(symbol: string): TokenMetadata | null {
    return this.metadataCache.get(symbol) || null;
  }

  static isImageUsed(imageUrl: string, currentSymbol: string): boolean {
    const existingSymbol = this.usedImages.get(imageUrl);
    return existingSymbol !== undefined && existingSymbol !== currentSymbol;
  }

  static cacheMetadata(symbol: string, metadata: TokenMetadata): void {
    // Allow reuse of images for now to prevent blocking token updates
    this.metadataCache.set(symbol, metadata);
    this.usedImages.set(metadata.image, symbol);
    console.log(`Successfully cached metadata for ${symbol}:`, metadata);
  }

  static validateTokenData(token: Partial<TokenData>): boolean {
    if (!token.symbol || !token.marketCap) {
      console.error('Missing required token data:', token);
      return false;
    }

    // Check validation attempts
    const attempts = this.validationQueue.get(token.symbol) || 0;
    if (attempts > this.MAX_VALIDATION_ATTEMPTS) {
      console.error(`Exceeded maximum validation attempts for token ${token.symbol}`);
      return false;
    }

    // If we have metadata cached, consider it valid
    const metadata = this.getCachedMetadata(token.symbol);
    if (metadata) {
      return true;
    }

    // For new tokens without cached metadata, require basic validation
    if (!token.name || !token.marketCap || token.marketCap <= 0) {
      console.error('Invalid token data:', token);
      return false;
    }

    return true;
  }

  static clearMetadataForToken(symbol: string): void {
    const metadata = this.metadataCache.get(symbol);
    if (metadata) {
      this.usedImages.delete(metadata.image);
      this.metadataCache.delete(symbol);
    }
    this.validationQueue.delete(symbol);
    this.processingTokens.delete(symbol);
  }
}