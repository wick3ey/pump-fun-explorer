import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toFixed(1);
}

// Browser polyfills
declare global {
  interface Window {
    global: any;
    process: any;
    Buffer: any;
  }
}

if (typeof window !== 'undefined') {
  window.global = window;
  window.process = { env: {} } as any;
  window.Buffer = window.Buffer || require('buffer').Buffer;
}