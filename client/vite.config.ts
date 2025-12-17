import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Rule: Whenever the path starts with "/api"...
      '/api': {
        target: 'http://localhost:3000', // ...forward it to port 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
})