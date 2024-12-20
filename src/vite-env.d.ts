/// <reference types="vite/client" />

interface Window {
  global: typeof globalThis;
}

declare global {
  interface Window {
    global: Window & typeof globalThis;
  }
}

export {};