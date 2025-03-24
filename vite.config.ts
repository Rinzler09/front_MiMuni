import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //En este espacio solo se descomenta para el servidor en la nube
  //server: {
    //host: '0.0.0.0',
    //port: 5174,
  //},
})
