import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [], // 未作成のファイルへの参照を削除
      manifest: {
        name: 'Info-Hub Task Manager',
        short_name: 'InfoHub',
        description: 'Premium PWA Task Management Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // エイリアス設定をよりシンプルに
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // ビルド設定を明示
  build: {
    outDir: 'dist',
  }
});
