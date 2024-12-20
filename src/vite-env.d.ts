/// <reference types="vite/client" />

interface Window {
  global: typeof window;
  Buffer: typeof Buffer;
}

declare global {
  interface Window {
    global: Window;
    Buffer: typeof Buffer;
  }
  var Buffer: typeof Buffer;
}