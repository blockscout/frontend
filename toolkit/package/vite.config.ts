import react from '@vitejs/plugin-react';
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// Plugin to copy TypeScript files
const copyThemeSrc = () => ({
  name: 'copy-ts-files',
  closeBundle: async() => {
    const srcDir = resolve(__dirname, '../theme');
    const destDir = resolve(__dirname, './dist/theme');

    // Ensure destination directory exists
    await mkdir(destDir, { recursive: true });

    // Copy theme directory
    const files = await readdir(srcDir, { recursive: true });
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const srcPath = resolve(srcDir, file);
        const destPath = resolve(destDir, file);
        await mkdir(resolve(destPath, '..'), { recursive: true });
        await copyFile(srcPath, destPath);
      }
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
    dts({
      include: [
        '../chakra/**/*.tsx',
        '../theme/**/*.ts',
        '../components/**/*',
        '../utils/**/*.ts',
        '../hooks/**/*.tsx',
        './src/**/*.ts',
        './src/**/*.tsx',
        '../../global.d.ts',
        '../../decs.d.ts',
        '../../reset.d.ts',
      ],
      rollupTypes: false,
      outDir: './dist',
      insertTypesEntry: true,
      entryRoot: '..',
    }),
    copyThemeSrc(),
  ],
  resolve: {
    alias: {
      configs: resolve(__dirname, '../../configs'),
      lib: resolve(__dirname, '../../lib'),
      types: resolve(__dirname, '../../types'),
      icons: resolve(__dirname, '../../icons'),
      ui: resolve(__dirname, '../../ui'),
      'public': resolve(__dirname, '../../public'),
      toolkit: resolve(__dirname, '.'),
    },
  },
  build: {
    lib: {
      entry: {
        components: resolve(__dirname, '../components/index.ts'),
        chakra: resolve(__dirname, '../chakra/index.ts'),
        theme: resolve(__dirname, '../theme/index.ts'),
        hooks: resolve(__dirname, '../hooks/index.ts'),
        utils: resolve(__dirname, '../utils/index.ts'),
      },
      formats: [ 'es' ],
    },
    outDir: './dist',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@chakra-ui/react',
        '@emotion/react',
        'use-font-face-observer',
        'next/link',
        'next-themes',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: '..',
        exports: 'named',
        interop: 'auto',
      },
    },
  },
});
