import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config';

// Primed-request drift tests (src/server/primedRequests/CONTEXT.md) mount whole pages without
// exercising behaviour, so every mutant they kill is killed incidentally — and they dominate the
// runtime of a Stryker run. They are excluded from execution rather than from Stryker's sandbox,
// because the drift check in src/server/primedRequests/index.spec.ts globs them off disk.
export default mergeConfig(baseConfig, defineConfig({
  test: {
    exclude: [ '**/*.primed.spec.tsx' ],
  },
}));
