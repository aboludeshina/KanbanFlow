import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // Drag and Drop libraries can have issues with StrictMode in development, 
  // but @hello-pangea/dnd is generally compliant.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);