import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build', // CRA used 'build' instead of 'dist', keep it for now if Vercel relies on it
  },
  define: {
    // Vite uses import.meta.env, but if they rely on process.env in the code (e.g. process.env.REACT_APP_API_URL), 
    // we should polyfill it or they will get undefined errors.
    // Better to map env prefixed with REACT_APP to process.env.REACT_APP_
    'process.env': process.env
  }
});
