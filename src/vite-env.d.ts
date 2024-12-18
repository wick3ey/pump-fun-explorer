/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
  global: typeof window;
  process: { env: Record<string, string> };
  EventEmitter: any;
  eventEmitter: any;
}