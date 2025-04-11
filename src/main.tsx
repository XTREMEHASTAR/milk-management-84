
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DataProvider } from './contexts/DataContext.tsx'

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Mounting React app to DOM');

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <DataProvider>
        <App />
      </DataProvider>
    );
    console.log('React app successfully mounted');
  } catch (error) {
    console.error('Error mounting React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2 style="color: red;">Failed to load application</h2>
        <p>Check the console for details.</p>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
