/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
  global: typeof window;
  process: any;
}

declare module 'process/browser' {
  const process: NodeJS.Process;
  export default process;
}