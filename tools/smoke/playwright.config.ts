import { defineConfig, devices } from '@playwright/test';
import path from 'path';

import { MINUTE, SECOND } from 'src/toolkit/utils/consts';

// apart from the dev server's 3000 and the component tests' 3100, so a server left running on either does not block the run
const PORT = 3200;

const preset = process.env.SMOKE_PRESET;
if (!preset) {
  throw new Error('Run the smoke set with `pnpm test:smoke`, which builds the app and passes its preset in SMOKE_PRESET');
}

// The Playwright config docs - https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: '.',
  testMatch: /.*\.smoke\.ts$/,
  outputDir: 'results',

  timeout: MINUTE,
  expect: { timeout: 20 * SECOND },

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // the set runs against a live backend, whose slow or dropped responses are not what it tests
  retries: 2,

  reporter: [
    [ 'list' ],
    [ 'html', { outputFolder: 'report', open: 'never' } ],
  ],

  use: {
    baseURL: `http://localhost:${ PORT }`,
    screenshot: 'off',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: `./tools/dev-server/prod.preset.sh ${ preset } --skip-build --port ${ PORT }`,
    cwd: path.resolve(__dirname, '../..'),
    url: `http://localhost:${ PORT }/node-api/healthz`,
    timeout: 2 * MINUTE,
    reuseExistingServer: false,
    env: {
      // a chain served by the PRO API links to the external developer portal instead, and the page under test is then a 404
      NEXT_PUBLIC_API_DOCS_TABS: JSON.stringify([ 'rest_api' ]),
    },
  },
});
