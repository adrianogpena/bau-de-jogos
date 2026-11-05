import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// O app é publicado em https://<usuario>.github.io/bau-de-jogos/
const BASE = '/bau-de-jogos/';

export default defineConfig(({ command }) => ({
  base: BASE,
  // aceita qualquer endereço no servidor de testes (ex.: a pré-visualização do Claude na nuvem)
  server: { allowedHosts: true },
  plugins: [
    react(),
    // o service worker só existe no build; no servidor de testes ele serviria arquivos antigos
    command === 'build' &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icone.svg'],
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
          {
            src: 'icone.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
}));
