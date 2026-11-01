import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/IITBh-Meraz/',
  css: {
    devSourcemap: true,
  },
  build: {
    cssMinify: false,
  },
})
