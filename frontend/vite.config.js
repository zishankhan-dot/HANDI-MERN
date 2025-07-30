// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // 3001 port for frontend
    strictPort: true // throws an error if 3001 is taken
  }
});