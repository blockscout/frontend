import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../../vitest.config';

// Primed-request drift tests (src/server/primedRequests/CONTEXT.md) import huge swaths of the app, so
// a module-graph selection pulls them in for almost any file at a large page-mount cost and no useful
// coverage. The exclusion is a config of its own because the `--exclude` flag does not reach the
// projects of the root config, which name their own files; an exclude in the root config does.
export default mergeConfig(baseConfig, defineConfig({
  test: {
    exclude: [ '**/*.primed.spec.tsx' ],
  },
}));
