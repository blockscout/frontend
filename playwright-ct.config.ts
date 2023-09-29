import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';
import { devices, defineConfig } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = defineConfig({
  testDir: './',

  testMatch: /.*\.pw\.tsx/,

  snapshotPathTemplate: '{testDir}/{testFileDir}/__screenshots__/{testFileName}_{projectName}_{arg}{ext}',

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
      build: {
        // it actually frees some memory that vite needs a lot
        // https://github.com/storybookjs/builder-vite/issues/409#issuecomment-1152848986
        sourcemap: false,
        minify: false,
      },
      resolve: {
        alias: {
          // There is an issue with building these package using vite that I cannot resolve
          // The solution described here - https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
          // doesn't seam to work well with our setup
          // so for now we just mock these modules in tests
          '@metamask/post-message-stream': './playwright/mocks/modules/@metamask/post-message-stream.js',
          '@metamask/providers': './playwright/mocks/modules/@metamask/providers.js',
        },
      },
      define: {
        'process.env': '__envs', // Port process.env over window.__envs
      },
    },
  },

  // configured projects
  // these projects are also used for sharding tests in CI
  // when adding or deleting a project, make sure to update github workflow accordingly
  projects: [
    {
      name: 'default',
      grepInvert: /-@default/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 750 },
      },
    },
    {
      name: 'mobile',
      grep: /\+@mobile/,
      use: {
        ...devices['iPhone 13 Pro'],
      },
    },
    {
      name: 'dark-color-mode',
      grep: /\+@dark-mode/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 750 },
        colorScheme: 'dark',
      },
    },
  ],
});

export default config;
