import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EventEmitter } from 'events';

// Polyfill Buffer global
window.Buffer = Buffer;
window.global = window;

// Create minimal process object with required properties
const process = {
  env: {},
  stdout: null,
  stderr: null,
  stdin: null,
  argv: [],
  argv0: '',
  execPath: '',
  execArgv: [],
  version: '',
  versions: {},
  pid: -1,
  ppid: -1,
  platform: 'browser',
  arch: '',
  title: 'browser',
  browser: true,
  release: {},
  config: {},
  cwd: () => '/',
  chdir: () => { throw new Error('Not implemented'); },
  exit: () => { throw new Error('Not implemented'); },
  kill: () => { throw new Error('Not implemented'); },
  nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
} as unknown as NodeJS.Process;

window.process = process;

// Add EventEmitter polyfill
const eventEmitter = new EventEmitter();
window.EventEmitter = EventEmitter;
window.eventEmitter = eventEmitter;

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