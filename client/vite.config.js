import { defineConfig, preprocessCSS } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();
var NODE_ENV = process.env.NODE_ENV;
var URL;

if (typeof NODE_ENV != "undefined"){
  if (NODE_ENV == 'production'){
    URL = 'https://oasispos-6173005c2083.herokuapp.com/'
  }
  else{
    URL = 'http://127.0.0.1:3000/'
  }

}




// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/': {
        target: URL, // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace('/', ''),
      },
    },
  },
  plugins: [
    react(), 
  ],
});
