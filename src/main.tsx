
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CommandPalette } from './components/CommandPalette';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <CommandPalette />
  </React.StrictMode>
);
