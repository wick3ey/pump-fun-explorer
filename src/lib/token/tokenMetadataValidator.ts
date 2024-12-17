import { TokenData } from "@/types/token";

export interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

export class TokenMetadataValidator {
  private static metadataCache = new Map<string, TokenMetadata>();
  private static processingTokens = new Set<string>();
  private static usedImages = new Map<string, string>(); // Track which images are used by which tokens
  private static validationQueue = new Map<string, number>(); // Track validation attempts
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
    // Double-check image isn't already used
    if (this.isImageUsed(metadata.image, symbol)) {
      console.error(`Metadata validation failed: Image ${metadata.image} is already used by token ${this.usedImages.get(metadata.image)}`);
      return;
    }

    // Clear any previous image association for this token
    const previousMetadata = this.metadataCache.get(symbol);
    if (previousMetadata) {
      this.usedImages.delete(previousMetadata.image);
    }

    this.metadataCache.set(symbol, metadata);
    this.usedImages.set(metadata.image, symbol);
    console.log(`Successfully cached metadata for ${symbol}:`, metadata);
  }

  static validateTokenData(token: Partial<TokenData>): boolean {
    if (!token.symbol || !token.name || !token.marketCap || token.marketCap <= 0) {
      console.error('Invalid token data:', token);
      return false;
    }

    // Check if we've exceeded max validation attempts
    const attempts = this.validationQueue.get(token.symbol) || 0;
    if (attempts > this.MAX_VALIDATION_ATTEMPTS) {
      console.error(`Exceeded maximum validation attempts for token ${token.symbol}`);
      return false;
    }

    const metadata = this.getCachedMetadata(token.symbol);
    if (!metadata || !metadata.image || !metadata.description) {
      console.error('Missing or invalid metadata for token:', token.symbol);
      return false;
    }

    // Verify image URL format and ensure it's not a placeholder
    if (!this.isValidImageUrl(metadata.image)) {
      console.error('Invalid image URL format for token:', token.symbol);
      return false;
    }

    // Final verification that image isn't used by another token
    if (this.isImageUsed(metadata.image, token.symbol)) {
      console.error(`Image collision detected: ${metadata.image} is already used by ${this.usedImages.get(metadata.image)}`);
      return false;
    }

    return true;
  }

  private static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.protocol === 'https:' &&
        !url.includes('placeholder') &&
        (
          url.endsWith('.png') || 
          url.endsWith('.jpg') || 
          url.endsWith('.jpeg') || 
          url.includes('coinmarketcap.com')
        )
      );
    } catch {
      return false;
    }
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