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
    // the design-readout calibration set is read with fs, not imported, so a `--changed` run would
    // not see an edited entry; its spec is what keeps the committed set green
    forceRerunTriggers: [ 'tools/design-readout/calibration/**' ],
    // specs in the shared project run in one module registry and one global scope per worker, so
    // whatever a spec stubs or spies on is undone before every test rather than left to the spec;
    // vitest/setup.ts undoes it after every test too, which is what covers the last test of a file
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
    // Two projects, split by file name. Evaluating the shared module graph once per spec file is the
    // largest single cost of a run, so a spec shares its worker's module registry unless its name says
    // it needs a fresh one. The rule for which is which: .agents/rules/tests-unit.md -> "Isolation".
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
