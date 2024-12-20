import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Initialize global objects
    if (typeof window !== 'undefined') {
      if (!window.Buffer) {
        window.Buffer = Buffer;
      }
      
      if (!(window as any).global) {
        (window as any).global = window;
      }
      
      if (!(window as any).process) {
        (window as any).process = {
          env: { NODE_ENV: process.env.NODE_ENV },
          browser: true,
          version: '',
          cwd: () => '/',
          nextTick: (fn: Function, ...args: any[]) => {
            return Promise.resolve().then(() => fn(...args));
          },
        };
      }
    }
    
    // Initialize Buffer globally
    if (!(globalThis as any).Buffer) {
      (globalThis as any).Buffer = Buffer;
    }
    
    // Initialize process globally
    if (!(globalThis as any).process) {
      (globalThis as any).process = {
        env: { NODE_ENV: process.env.NODE_ENV },
        browser: true,
        version: '',
        cwd: () => '/',
        nextTick: (fn: Function, ...args: any[]) => {
          return Promise.resolve().then(() => fn(...args));
        },
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
    if (!data) {
      throw new Error('Invalid data provided to createSafeBuffer');
    }
    return Buffer.from(data);
  } catch (error) {
    console.error('Failed to create Buffer:', error);
    return null;
  }
};

export const isBufferSupported = () => {
  try {
    return typeof Buffer !== 'undefined' && 
           typeof Buffer.from === 'function' && 
           typeof Buffer.alloc === 'function';
  } catch {
    return false;
  }
};

export const ensureBufferCompat = () => {
  if (!isBufferSupported()) {
    console.warn('Buffer support is not complete. Some features may not work correctly.');
    return false;
  }
  return true;
};