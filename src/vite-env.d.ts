/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
  global: typeof window;
  process: NodeJS.Process;
  EventEmitter: any;
  eventEmitter: any;
  Stream: any;
}