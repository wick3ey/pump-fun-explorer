import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Ensure Buffer is available globally
    if (typeof window !== 'undefined') {
      window.Buffer = Buffer;
      (window as any).global = window;
    }
    
    // Initialize Buffer globally
    (globalThis as any).Buffer = Buffer;
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Buffer polyfills:', error);
    return false;
  }
};

export const createSafeBuffer = (data: any) => {
  try {
    return Buffer.from(data);
  } catch (error) {
    console.error('Failed to create Buffer:', error);
    return null;
  }
};

export const isBufferSupported = () => {
  try {
    return typeof Buffer !== 'undefined' && typeof Buffer.from === 'function';
  } catch {
    return false;
  }
};