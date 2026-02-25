import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['unrecounted-conversationally-mireille.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://192.168.0.110:3000',
        changeOrigin: true,
      },
      // Proxy Socket.IO (HTTP long-polling + WebSocket) through Vite as well
      '/socket.io': {
        target: 'http://192.168.0.110:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
