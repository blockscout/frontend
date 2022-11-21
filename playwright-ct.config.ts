import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';
import { devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './',

  testMatch: /.*\.pw\.tsx/,

  snapshotPathTemplate: '{testDir}/{testFileDir}/__screenshots__/{testFileName}_{arg}{ext}',

  /* Maximum time one test can run for. */
  timeout: 10 * 1000,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,

    headless: true,

    ctViteConfig: {
      plugins: [
        tsconfigPaths(),
        react(),
        svgr({
          exportAsDefault: true,
        }),
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
};

export default config;
