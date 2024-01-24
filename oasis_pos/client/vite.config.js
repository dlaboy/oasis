import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    base: '/oasispos/',
    port:3000,
    proxy: {
      '/orders': {
        target: 'https://oasispos-6173005c2083.herokuapp.com/orders', // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace('/orders', ''),
      },
    },
  },
  plugins: [
    react(), 
  ],
});
