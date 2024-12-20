import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeBufferPolyfills } from './utils/bufferPolyfills';

// Initialize Buffer polyfills
const bufferInitialized = initializeBufferPolyfills();
if (!bufferInitialized) {
  console.error('Failed to initialize Buffer polyfills. Some features may not work correctly.');
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