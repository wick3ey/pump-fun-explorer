/// <reference types="vite/client" />

interface Window {
  global: typeof globalThis;
  Buffer: typeof Buffer;
}

declare global {
  interface Window {
    global: Window & typeof globalThis;
    Buffer: typeof Buffer;
  }
  var Buffer: typeof Buffer;
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      // Add other env variables here
    }
  }
}

export {};