import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Ensure Buffer and process are available globally
    if (typeof window !== 'undefined') {
      window.Buffer = Buffer;
      (window as any).global = window;
      
      // Initialize process if not available
      if (!(window as any).process) {
        (window as any).process = {
          env: { NODE_ENV: process.env.NODE_ENV },
          browser: true,
          version: '',
          cwd: () => '/',
        };
      }
    }
    
    // Initialize Buffer globally
    (globalThis as any).Buffer = Buffer;
    
    // Initialize process globally if not available
    if (!(globalThis as any).process) {
      (globalThis as any).process = {
        env: { NODE_ENV: process.env.NODE_ENV },
        browser: true,
        version: '',
        cwd: () => '/',
      };
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize polyfills:', error);
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