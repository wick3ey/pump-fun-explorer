// Import and initialize Buffer first
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeBufferPolyfills, ensureBufferCompat } from './utils/bufferPolyfills';

// Initialize Buffer polyfills with proper error handling
console.log('Initializing Buffer polyfills...');
const bufferInitialized = initializeBufferPolyfills();
if (!bufferInitialized) {
  console.error('Failed to initialize Buffer polyfills');
  throw new Error('Buffer initialization failed');
}

// Verify Buffer compatibility
console.log('Verifying Buffer compatibility...');
if (!ensureBufferCompat()) {
  console.error('Buffer compatibility check failed');
  throw new Error('Buffer compatibility check failed');
}

// Initialize root element
const rootElement = document.getElementById('root');
  
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);