import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import 'animate.css';
import './global.scss';
import { HelmetProvider } from 'react-helmet-async'; 

setTimeout(async () => {
  const container = document.getElementById('root');
  if (!container) return;
  const { App } = await import('./app');
  createRoot(container).render( 
  <HelmetProvider>
    <App />
  </HelmetProvider>
  );

}, 1_000);

