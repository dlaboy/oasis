import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    base: '/oasispos/',
    port:5173,
    proxy: {
      '/orders': {
        target: 'http://localhost:3000/orders', // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace('/orders', ''),
      },
    },
  },
  plugins: [
    react(), 
  ],
});
