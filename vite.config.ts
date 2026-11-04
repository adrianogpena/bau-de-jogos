import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
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
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fff7e6',
        theme_color: '#ff8a3d',
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
});
