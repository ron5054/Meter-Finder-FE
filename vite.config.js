import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Meter Finder',
        short_name: 'Meter Finder',
        description:
          'a small app designed to help electric meter readears to save the location of hard to find electric meters thus helping them find the location next time',
        theme_color: '#ffffff',
        version: '1.1.3',
        icons: [
          {
            src: '/icons/256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
})
