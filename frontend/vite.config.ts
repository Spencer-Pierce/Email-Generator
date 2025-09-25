import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/login": "http://localhost:4000",
      "/generate": "http://localhost:4000",
      "/refine": "http://localhost:4000",
      "/history": "http://localhost:4000",
    },
  },
})
