/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
  global: typeof window;
  process: any;
}