import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      // Aquí es donde apuntamos a esos archivos que acabamos de verificar
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem')),
      key:  fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem'))
    },
    host: '0.0.0.0',
    port: 5173,
    
    
  }
})
