import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'favicon-192.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'android/*.png', 'ios/*.png'],
      manifest: {
        name: 'OrganiAPP',
        short_name: 'OrganiAPP',
        description: 'Administra tu dinero mediante sobres virtuales. Funciona 100% sin internet.',
        lang: 'es',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: 'android/launchericon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: 'android/launchericon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: 'android/launchericon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: 'android/launchericon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'ios/180.png', sizes: '180x180', type: 'image/png' },
          { src: 'ios/192.png', sizes: '192x192', type: 'image/png' },
          { src: 'ios/512.png', sizes: '512x512', type: 'image/png' },
          { src: 'ios/1024.png', sizes: '1024x1024', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [/^\/sw\.js$/, /^\/registerSW\.js$/]
      },
      devOptions: { enabled: false }
    })
  ],
})
