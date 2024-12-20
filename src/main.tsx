import { Buffer } from 'buffer';
window.Buffer = Buffer;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeBufferPolyfills, ensureBufferCompat } from './utils/bufferPolyfills';

// Initialize Buffer polyfills
const bufferInitialized = initializeBufferPolyfills();
if (!bufferInitialized) {
  console.error('Failed to initialize Buffer polyfills. Some features may not work correctly.');
  throw new Error('Buffer initialization failed');
}

// Verify Buffer compatibility
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