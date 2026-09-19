import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/config';
import './index.css';
import { initTheme } from './theme';
import App from './App';

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);