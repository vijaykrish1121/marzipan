import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Marzipan',
      fileName: (format) => `index.${format === 'es' ? 'js' : format}`,
      formats: ['es']
    },
    sourcemap: true,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})