import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predicciones': {
        target: 'https://apuestas-jify.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
