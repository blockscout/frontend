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

const ISOLATED_SPECS = [ '**/*.isolated.spec.ts', '**/*.isolated.spec.tsx', '**/*.primed.spec.tsx' ];

export default defineConfig({
  plugins: [
    svgStub,
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globalSetup: [ './vitest/global-setup.ts' ],
    setupFiles: [ './vitest/setup.ts' ],
    // these are read with fs, not imported, so a `--changed` run would not see an edit: the
    // design-readout calibration set, and the Renovate config and PR template that the PR check's
    // spec holds together
    forceRerunTriggers: [ 'tools/design-readout/calibration/**', '.github/renovate.json', 'docs/PULL_REQUEST_TEMPLATE.md' ],
    // specs in the shared project run in one module registry and one global scope per worker, so
    // whatever a spec stubs or spies on is undone before every test rather than left to the spec
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    // agent worktrees are full checkouts of the repo; their specs would run a second time.
    // Stryker's sandbox is a copy of the repo too, and survives a run it did not finish.
    exclude: [
      '**/node_modules/**',
      '**/node_modules_linux/**',
      '.claude/worktrees/**',
      'tools/mutation-testing/.stryker-tmp/**',
    ],
    projects: [
      {
        test: {
          name: 'shared',
          isolate: false,
          sequence: { groupOrder: 0 },
          // the first `withEnvs` test of a spec re-evaluates the app's module graph inside its own body,
          // and on a loaded machine that alone ran past 10s
          testTimeout: 15_000,
          include: [ '**/*.spec.ts', '**/*.spec.tsx' ],
          exclude: ISOLATED_SPECS,
        },
      },
      {
        test: {
          name: 'isolated',
          // after `shared`, not alongside it: started together the two projects each fill the
          // machine with workers, and the page-mounting specs here then run into their timeouts
          sequence: { groupOrder: 1 },
          // a test here often re-evaluates modules inside its own body after a registry reset
          // (`vi.resetModules`, `withEnvs`), and with every such spec in one project they all compete
          // for the machine at once
          testTimeout: 15_000,
          include: ISOLATED_SPECS,
        },
      },
    ],
  },
});
