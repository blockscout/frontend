import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config';

// Primed-request drift tests (src/server/primedRequests/CONTEXT.md) mount whole pages without
// exercising behaviour, so every mutant they kill is killed incidentally — and they dominate the
// runtime of a Stryker run. They are excluded from execution rather than from Stryker's sandbox,
// because the drift check in src/server/primedRequests/index.spec.ts globs them off disk.
// Naming a reporter is what keeps Vitest's own github-actions reporter off: Vitest appends that one
// to the defaults whenever $GITHUB_ACTIONS is set. It writes a "Vitest Test Report" block to the job
// summary per test run, and Stryker ends one of those per mutant — so the summary would fill with
// hundreds of them, each killed mutant reported as a test failure, above the report that matters.
export default mergeConfig(baseConfig, defineConfig({
  test: {
    exclude: [ '**/*.primed.spec.tsx' ],
    reporters: [ 'default' ],
  },
}));
