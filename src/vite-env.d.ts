/// <reference types="vite/client" />

interface Window {
  global: typeof window;
}

declare module 'process/browser';
declare module 'stream-browserify';
declare module 'https-browserify';
declare module 'browserify-zlib';
declare module 'path-browserify';
declare module 'crypto-browserify';
declare module 'os-browserify';
declare module 'vm-browserify';
declare module 'assert';
declare module 'url';
declare module 'util';
declare module 'stream-http';
declare module 'vite-compatible-readable-stream';