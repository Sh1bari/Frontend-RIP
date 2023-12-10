import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Frontend-RIP',
  server: { port: 3000 },
  plugins: [react()],
  build: {
    outDir: 'dist', // Путь к директории сборки
  },
})
