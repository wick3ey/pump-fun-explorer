import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Initialize process globally
    if (typeof window !== 'undefined') {
      window.Buffer = Buffer;
      (window as any).global = window;
      
      if (!(window as any).process) {
        (window as any).process = {
          env: { NODE_ENV: process.env.NODE_ENV },
          browser: true,
          version: '',
          cwd: () => '/',
          nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
        };
      }
    }
    
    (globalThis as any).Buffer = Buffer;
    
    if (!(globalThis as any).process) {
      (globalThis as any).process = {
        env: { NODE_ENV: process.env.NODE_ENV },
        browser: true,
        version: '',
        cwd: () => '/',
        nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
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