import { EventEmitter } from 'events';
import { TokenData } from '@/types/token';

class TokenWebSocket {
  private onNewTokenCallback: ((data: TokenData) => void) | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Empty implementation - no initialization needed
  }

  public onNewToken(callback: (data: TokenData) => void) {
    this.onNewTokenCallback = callback;
  }

  public disconnect() {
    // Empty implementation - no cleanup needed
  }
}

export const tokenWebSocket = new TokenWebSocket();