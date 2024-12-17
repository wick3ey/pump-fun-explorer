import { TokenData } from "@/types/token";

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
  private static verifiedMetadata = new Map<string, boolean>();

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
    // Temporarily disable image uniqueness check
    return false;
  }

  static verifyMetadata(symbol: string, metadata: TokenMetadata): boolean {
    // Basic validation checks
    if (!metadata.image || !metadata.name) {
      return false;
    }

    // Verify image URL is valid
    if (!metadata.image.startsWith('http') && !metadata.image.startsWith('/')) {
      return false;
    }

    return true;
  }

  static cacheMetadata(symbol: string, metadata: TokenMetadata): void {
    this.metadataCache.set(symbol, metadata);
    this.verifiedMetadata.set(symbol, true);
  }

  static validateTokenData(token: Partial<TokenData>): boolean {
    if (!token.symbol) {
      console.error('Missing symbol in token data');
      return false;
    }

    // Allow tokens even without market cap for now
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
    this.verifiedMetadata.delete(symbol);
  }
}