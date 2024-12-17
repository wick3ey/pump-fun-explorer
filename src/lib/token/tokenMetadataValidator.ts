import { TokenData } from "@/types/token";

export interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

export class TokenMetadataValidator {
  private static metadataCache = new Map<string, TokenMetadata>();
  private static processingTokens = new Set<string>();

  static isProcessing(symbol: string): boolean {
    return this.processingTokens.has(symbol);
  }

  static startProcessing(symbol: string): void {
    this.processingTokens.add(symbol);
  }

  static finishProcessing(symbol: string): void {
    this.processingTokens.delete(symbol);
  }

  static getCachedMetadata(symbol: string): TokenMetadata | null {
    return this.metadataCache.get(symbol) || null;
  }

  static cacheMetadata(symbol: string, metadata: TokenMetadata): void {
    this.metadataCache.set(symbol, metadata);
  }

  static validateTokenData(token: Partial<TokenData>): boolean {
    if (!token.symbol || !token.name || !token.marketCap || token.marketCap <= 0) {
      console.log('Invalid token data:', token);
      return false;
    }

    const metadata = this.getCachedMetadata(token.symbol);
    if (!metadata || !metadata.image || !metadata.description) {
      console.log('Missing or invalid metadata for token:', token.symbol);
      return false;
    }

    // Verify that this metadata hasn't been used for another token
    for (const [cachedSymbol, cachedMetadata] of this.metadataCache.entries()) {
      if (cachedSymbol !== token.symbol && cachedMetadata.image === metadata.image) {
        console.log('Duplicate metadata detected:', {
          currentToken: token.symbol,
          existingToken: cachedSymbol,
          metadata
        });
        return false;
      }
    }

    return true;
  }
}