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
    const existingSymbol = this.usedImages.get(imageUrl);
    return existingSymbol !== undefined && existingSymbol !== currentSymbol;
  }

  static verifyMetadata(symbol: string, metadata: TokenMetadata): boolean {
    // Verify that the metadata matches the token symbol
    if (!metadata.name.includes(symbol) && !symbol.includes(metadata.name)) {
      console.warn(`Metadata name mismatch for ${symbol}:`, metadata.name);
      return false;
    }

    // Check if image is already used by another token
    if (this.isImageUsed(metadata.image, symbol)) {
      console.warn(`Image already used by another token: ${metadata.image}`);
      return false;
    }

    // Verify image URL is valid
    if (!metadata.image.startsWith('http') && !metadata.image.startsWith('/')) {
      console.warn(`Invalid image URL for ${symbol}:`, metadata.image);
      return false;
    }

    return true;
  }

  static cacheMetadata(symbol: string, metadata: TokenMetadata): void {
    if (this.verifyMetadata(symbol, metadata)) {
      this.metadataCache.set(symbol, metadata);
      this.usedImages.set(metadata.image, symbol);
      this.verifiedMetadata.set(symbol, true);
      console.log(`Successfully cached verified metadata for ${symbol}:`, metadata);
    } else {
      // Use default metadata if verification fails
      const defaultMetadata: TokenMetadata = {
        image: "/placeholder.svg",
        description: `${symbol} Token on Solana`,
        name: symbol
      };
      this.metadataCache.set(symbol, defaultMetadata);
      console.warn(`Using default metadata for ${symbol} due to verification failure`);
    }
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

    // Verify metadata if present
    if (token.image && token.name) {
      const isVerified = this.verifyMetadata(token.symbol, {
        image: token.image,
        name: token.name,
        description: token.description || `${token.symbol} Token on Solana`
      });

      if (!isVerified) {
        console.warn(`Metadata verification failed for ${token.symbol}`);
        return false;
      }
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
    this.verifiedMetadata.delete(symbol);
  }
}