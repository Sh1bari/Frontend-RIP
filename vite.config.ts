import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Frontend-RIP/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }}},
  plugins: [react()],
  build: {
    outDir: 'dist', // Путь к директории сборки
  },
})
