/// <reference types="vite/client" />

interface Window {
  global: typeof window;
}

declare module 'process/browser';