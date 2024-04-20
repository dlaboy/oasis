import { defineConfig, preprocessCSS } from 'vite'
import react from '@vitejs/plugin-react'
const dotenv = require('dotenv');

dotenv.config()
var NODE_ENV = process.env.NODE_ENV;
var URL;

if (NODE_ENV != None){
  if (NODE_ENV == production){
    URL = 'https://oasispos-6173005c2083.herokuapp.com/orders'
  }
  else{
    URL = 'http://127.0.0.1:3000/orders'
  }

}




// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/orders': {
        target: URL, // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace('/orders', ''),
      },
    },
  },
  plugins: [
    react(), 
  ],
});
