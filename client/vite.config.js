import { defineConfig, preprocessCSS } from 'vite'
import react from '@vitejs/plugin-react'
const dotenv = require('dotenv');

var development = process.env.development;
var URL;

if (development != ""){
  if (development == True){
    URL = 'http://127.0.0.1:3000/orders'
  }
  else{
    URL = 'https://oasispos-6173005c2083.herokuapp.com/orders'
  }

}


dotenv.config();


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
