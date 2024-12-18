import { Buffer } from 'buffer';
import process from 'process/browser';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize required globals
window.Buffer = Buffer;
window.global = window;
window.process = process;

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