import { resolve } from 'path';
import { defineConfig } from 'vite';

const JSON_CONFIGS_MODE = 'json-configs';

// The Dockerfile ships `dist/index.js` alone, so each entry is its own build: two entries in one build
// would move the code they share into a chunk the image does not copy.
export default defineConfig(({ mode }) => {
  const entryName = mode === JSON_CONFIGS_MODE ? 'json-configs-cli' : 'index';

  return {
    build: {
      emptyOutDir: mode !== JSON_CONFIGS_MODE,
      lib: {
        entry: {
          [entryName]: resolve(__dirname, `${ entryName }.ts`),
        },
        formats: [ 'es' ],
        fileName: (format, name) => `${ name }.js`,
      },
      rolldownOptions: {
        external: [ 'node:worker_threads', 'node:url', 'node:path', 'node:fs', 'node:fs/promises' ],
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
        src: resolve(__dirname, '../../../src'),
        'public': resolve(__dirname, '../../../public'),
      },
    },
  };
});
