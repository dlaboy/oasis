import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/orders': {
        // target: 'https://oasispos-6173005c2083.herokuapp.com/orders', // Your API server addressx
        target: 'http://127.0.0.1:3000/orders', // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace('/orders', ''),
      },
    },
  },
  plugins: [
    react(), 
  ],
});
