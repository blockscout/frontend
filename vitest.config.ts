import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    globalSetup: [ './vitest/global-setup.ts' ],
    include: [ '**/*.spec.ts' ],
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**' ],
  },
});
