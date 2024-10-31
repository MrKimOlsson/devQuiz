import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/devquiz/',
  resolve: {
    alias: {
      '@assets': '/src/assets', // so you can use @assets/bg7.png in your imports
    },
  },
});
