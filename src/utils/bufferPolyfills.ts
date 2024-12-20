import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Initialize Buffer globally before anything else
    if (typeof window !== 'undefined') {
      window.Buffer = Buffer;
      (window as any).global = window;
      (window as any).process = {
        env: { NODE_ENV: process.env.NODE_ENV },
        browser: true,
        version: '',
        cwd: () => '/',
        nextTick: (fn: Function, ...args: any[]) => queueMicrotask(() => fn(...args)),
      };
    }

    // Ensure Buffer is available globally
    (globalThis as any).Buffer = Buffer;
    
    // Verify Buffer functionality
    try {
      Buffer.from('test');
    } catch (e) {
      console.error('Buffer.from is not working:', e);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize polyfills:', error);
    return false;
  }
};

export const ensureBufferCompat = () => {
  const testBuffer = Buffer.from('test');
  return testBuffer.length > 0;
};