import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { piperDev } from './scripts/piper-dev.mjs';
import { hashTexto } from './src/compartilhado/hashTexto';

// O app é publicado em https://<usuario>.github.io/bau-de-jogos/
const BASE = '/bau-de-jogos/';

export default defineConfig(({ command }) => ({
  base: BASE,
  // aceita qualquer endereço no servidor de testes (ex.: a pré-visualização do Claude na nuvem)
  server: { allowedHosts: true },
  plugins: [
    react(),
    // no servidor de testes, gera na hora o áudio das vozes do Piper (veja docs/NARRACAO-PIPER.md)
    // no Windows o pathname vem como "/C:/..."; tira a barra inicial antes da letra do disco
    piperDev({ raiz: decodeURIComponent(new URL('.', import.meta.url).pathname).replace(/^[/](?=[A-Za-z]:)/, ''), hashTexto }),
    // o service worker só existe no build; no servidor de testes ele serviria arquivos antigos
    command === 'build' &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icone-192.png', 'icone-512.png'],
      // guarda os pictogramas para o app funcionar offline
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] },
      manifest: {
        name: 'Baú de Jogos',
        short_name: 'Baú de Jogos',
        description: 'Jogos para aprender e brincar',
        lang: 'pt',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'any',
        background_color: '#0d1024',
        theme_color: '#0d1024',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
}));
