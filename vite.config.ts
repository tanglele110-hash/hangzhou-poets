import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  // base 用于资源引用前缀。
  // - 默认 `/`：本地 dev、EdgeOne Pages（绑域名后挂根路径）、Releases dist.zip
  // - GitHub Pages 部署到 https://<user>.github.io/<repo>/ 时，CI 注入 VITE_BASE_PATH=/<repo>/
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3-force': ['d3-force'],
          'd3-zoom': ['d3-zoom', 'd3-drag'],
        },
      },
    },
  },
}));
