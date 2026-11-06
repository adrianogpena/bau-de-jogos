import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@fontsource-variable/lexend';
import '@fontsource/bungee';
import './estilos.css';
import { instalarLeituraGlobal } from './compartilhado/leituraGlobal';

instalarLeituraGlobal();

if (import.meta.env.DEV && new URLSearchParams(location.search).has('tablet')) {
  void import('./compartilhado/ferramentaTablet').then((m) => m.instalarFerramentaTablet());
}

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // remove service worker antigo para o servidor de testes mostrar os ajustes na hora
  void navigator.serviceWorker.getRegistrations().then(async (registros) => {
    if (registros.length === 0) return;
    await Promise.all(registros.map((r) => r.unregister()));
    for (const nome of await caches.keys()) await caches.delete(nome);
    location.reload();
  });
}

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
