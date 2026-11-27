import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseEnv } from 'util';

import { parseEnvJson, replaceQuotes } from 'src/config/utils/envs';

import { MINUTE, SECOND } from 'src/toolkit/utils/consts';

// apart from the dev server's 3000 and the component tests' 3100, so a server left running on either does not block the run
const PORT = 3200;

const REPO_ROOT = path.resolve(__dirname, '../..');

const preset = process.env.SMOKE_PRESET;
if (!preset) {
  throw new Error('Run the smoke set with `pnpm test:smoke`, which builds the app and passes its preset in SMOKE_PRESET');
}

// the server's env wins over the preset's value, so the preset's own overrides are merged in
const getPostHogConfigOverrides = (): string => {
  const presetEnvFile = path.join(REPO_ROOT, '.env.tmp');
  // without the fetched preset the server does not start, and says how to fetch it
  const presetEnvs: ReturnType<typeof parseEnv> = fs.existsSync(presetEnvFile) ? parseEnv(fs.readFileSync(presetEnvFile, 'utf8')) : {};
  const presetOverrides = parseEnvJson<Record<string, unknown>>(replaceQuotes(presetEnvs.NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES));

  return JSON.stringify({ ...presetOverrides, opt_out_useragent_filter: true });
};

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

  // On a pull request in CI the diff capture runs `git fetch --depth=1` on the base commit, which makes the
  // clone shallow there. The server's start script then finds no release tag for `git describe` and fails.
  captureGitInfo: { diff: false },

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
    cwd: REPO_ROOT,
    url: `http://localhost:${ PORT }/node-api/healthz`,
    timeout: 2 * MINUTE,
    reuseExistingServer: false,
    env: {
      // a chain served by the PRO API links to the external developer portal instead, and the page under test is then a 404
      NEXT_PUBLIC_API_DOCS_TABS: JSON.stringify([ 'rest_api' ]),
      // posthog-js drops every event from an automated browser (`navigator.webdriver`, the `HeadlessChrome` brand);
      // with the filter off it sends them, labelled as a bot's, and the fixture answers them
      NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES: getPostHogConfigOverrides(),
    },
  },
});
