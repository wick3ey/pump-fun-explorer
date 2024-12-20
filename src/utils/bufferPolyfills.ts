import { Buffer } from 'buffer';

export const initializeBufferPolyfills = () => {
  try {
    // Initialize Buffer and other globals before anything else
    if (typeof window !== 'undefined') {
      // Ensure Buffer is available on window
      window.Buffer = window.Buffer || Buffer;
      
      // Set up global object
      (window as any).global = window;
      
      // Ensure process is available
      (window as any).process = (window as any).process || {
        env: { NODE_ENV: process.env.NODE_ENV },
        browser: true,
        version: '',
        cwd: () => '/',
        nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
      };
    }

    // Ensure Buffer is available globally
    (globalThis as any).Buffer = Buffer;
    
    // Verify Buffer functionality
    try {
      const testBuffer = Buffer.from('test');
      Buffer.alloc(1); // Test alloc specifically
      return testBuffer.length > 0;
    } catch (e) {
      console.error('Buffer functionality test failed:', e);
      return false;
    }
  } catch (error) {
    console.error('Failed to initialize polyfills:', error);
    return false;
  }
};

export const ensureBufferCompat = () => {
  try {
    // Test both Buffer.from and Buffer.alloc
    const testBuffer1 = Buffer.from('test');
    const testBuffer2 = Buffer.alloc(1);
    return testBuffer1.length > 0 && testBuffer2.length === 1;
  } catch (error) {
    console.error('Buffer compatibility check failed:', error);
    return false;
  }
};