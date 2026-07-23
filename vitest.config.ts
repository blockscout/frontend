import tsconfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vitest/config';

// the Next.js build turns .svg imports into React components via @svgr/webpack;
// mirror that with a minimal stub so components importing svg files render in tests
const svgStub = {
  name: 'svg-stub',
  enforce: 'pre' as const,
  load(id: string) {
    if (id.split('?')[0].endsWith('.svg')) {
      return 'import React from "react"; export default function SvgStub(props) { return React.createElement("svg", props); }';
    }
  },
};

export default defineConfig({
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
    svgStub,
  ],
  test: {
    globalSetup: [ './vitest/global-setup.ts' ],
    setupFiles: [ './vitest/setup.ts' ],
    include: [ '**/*.spec.ts', '**/*.spec.tsx' ],
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**' ],
  },
});
