import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
    // Display a user-friendly error message
    rootElement.innerHTML = '<div style="color: white; padding: 20px;">Sorry, something went wrong. Please try refreshing the page.</div>';
  }
};

// Initialize the app with error boundary
try {
  renderApp();
} catch (error) {
  console.error('Critical error during app initialization:', error);
}