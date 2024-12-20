/// <reference types="vite/client" />

interface Window {
  global: typeof globalThis;
  Buffer: typeof Buffer;
  process: NodeJS.Process;
}

declare global {
  interface Window {
    global: Window & typeof globalThis;
    Buffer: typeof Buffer;
    process: NodeJS.Process;
  }
  var Buffer: typeof Buffer;
  var process: NodeJS.Process;
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      // Add other env variables here
    }
    interface Process {
      browser: boolean;
      version: string;
      cwd: () => string;
      nextTick: (callback: Function, ...args: any[]) => void;
    }
  }
}

export {};