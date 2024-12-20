import 'process';
import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set global variables for polyfills
window.Buffer = Buffer;
window.global = window;

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