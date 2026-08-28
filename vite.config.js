import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// package.json ha "type": "module": __dirname non esiste nei moduli ES
// (funzionava solo grazie allo shim che Vite inietta nel config).
const entry = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: entry('index.html'),
        pedemontana: entry('pedemontana.html'),
      },
    },
  },
})
