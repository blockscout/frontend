import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
      },
      formats: [ 'es' ],
      fileName: (format, entryName) => `${ entryName }.js`,
    },
    rollupOptions: {
      external: [ 'node:url', 'node:path', 'node:fs' ],
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      configs: resolve(__dirname, '../../../configs'),
    },
    preserveSymlinks: true,
  },
});
