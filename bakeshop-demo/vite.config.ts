import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pinkpixel/marzipan-core': path.resolve(__dirname, '../src'),
      '@pinkpixel/marzipan-core/plugins': path.resolve(__dirname, '../src/plugins')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
