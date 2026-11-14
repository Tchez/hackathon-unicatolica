import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

// Publicação no GitHub Pages, no subcaminho do repositório (SPEC 008). Domínio próprio: BASE_PATH=/.
const PAGES_BASE = '/hackathon-unicatolica/'

export default defineConfig(({ command }) => {
  const base = process.env.BASE_PATH ?? (command === 'build' ? PAGES_BASE : '/')
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        manifest: {
          name: 'Fidelidade Shopping',
          short_name: 'Fidelidade',
          description: 'Campanhas, pontos e indicação para visitantes de shopping centers.',
          lang: 'pt-BR',
          theme_color: '#B05828',
          background_color: '#FFFFFF',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
          ],
        },
      }),
    ],
    test: {
      environment: 'node',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.ts'],
    },
  }
})
