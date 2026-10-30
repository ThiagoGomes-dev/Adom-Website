import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Pede o catálogo ao painel já no HTML, junto com o download do JavaScript,
 * em vez de só depois que o site carrega. O fetch de src/lib/api.ts reaproveita
 * essa resposta (mesma URL, mesmo modo CORS).
 */
function preloadCatalog(): Plugin {
  let base = '';
  return {
    name: 'adom-preload-catalog',
    configResolved(config) {
      if (config.env.VITE_USE_MOCK_CATALOG === 'true') return;
      base = String(config.env.VITE_ADMIN_API_URL ?? '').replace(/\/$/, '');
    },
    transformIndexHtml() {
      if (!base) return [];
      return [
        { tag: 'link', attrs: { rel: 'preconnect', href: new URL(base).origin, crossorigin: '' }, injectTo: 'head' },
        ...['/api/products', '/api/categories'].map((p) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'fetch', href: `${base}${p}`, crossorigin: '' },
          injectTo: 'head' as const,
        })),
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadCatalog()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    // keep chunks reasonable for small marketing sites
    chunkSizeWarningLimit: 700,
  },
});
