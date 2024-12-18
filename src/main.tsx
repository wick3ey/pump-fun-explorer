import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EventEmitter } from 'events';

// Declare global window properties
declare global {
  interface Window {
    Buffer: typeof Buffer;
    global: typeof window;
    process: { env: Record<string, string> };
    EventEmitter: typeof EventEmitter;
  }
}

// Polyfill Buffer global
window.Buffer = Buffer;
window.global = window;
window.process = { env: {} } as any;

// Add EventEmitter polyfill
window.EventEmitter = EventEmitter;

const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error rendering the app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px;">Sorry, something went wrong. Please try refreshing the page.</div>';
  }
};

renderApp();