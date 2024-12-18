import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EventEmitter } from 'events';
import stream from 'stream-browserify';

// Ensure Buffer is available globally
window.Buffer = Buffer;
window.global = window;

// Create complete process object with required properties
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
  abort: () => { throw new Error('Not implemented'); },
  umask: () => 0,
  uptime: () => 0,
  hrtime: () => [0, 0],
  cpuUsage: () => ({ user: 0, system: 0 }),
  memoryUsage: () => ({
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0,
    arrayBuffers: 0
  }),
  nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
} as unknown as NodeJS.Process;

window.process = process;

// Set up EventEmitter
const eventEmitter = new EventEmitter();
window.EventEmitter = EventEmitter;
window.eventEmitter = eventEmitter;

// Initialize stream polyfills
window.Stream = stream;

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