import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';
import { devices, defineConfig } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import appConfig from 'configs/app';

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

  /* Opt out of parallel tests. */
  // on non-performant local machines some tests may fail due to lack of resources
  // so we opt out of parallel tests in any environment
  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: appConfig.app.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,

    headless: true,

    ctViteConfig: {
      plugins: [
        tsconfigPaths({ loose: true, ignoreConfigErrors: true }),
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
        alias: [
          // There is an issue with building these package using vite that I cannot resolve
          // The solution described here - https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
          // doesn't seam to work well with our setup
          // so for now we just mock these modules in tests
          { find: '@metamask/post-message-stream', replacement: './playwright/mocks/modules/@metamask/post-message-stream.js' },
          { find: '@metamask/providers', replacement: './playwright/mocks/modules/@metamask/providers.js' },

          // '@metamask/sdk imports the browser module as UMD, but @wagmi/connectors expects it to be ESM
          // so we do a little remapping here
          { find: '@metamask/sdk', replacement: './node_modules/@metamask/sdk/dist/browser/es/metamask-sdk.js' },

          // Mock for growthbook to test feature flags
          { find: 'lib/growthbook/useFeatureValue', replacement: './playwright/mocks/lib/growthbook/useFeatureValue.js' },

          // Mock for reCaptcha hook
          { find: 'ui/shared/reCaptcha/useReCaptcha', replacement: './playwright/mocks/ui/shared/recaptcha/useReCaptcha.js' },

          // The createWeb3Modal() function from web3modal/wagmi/react somehow pollutes the global styles which causes the tests to fail
          // We don't call this function in TestApp and since we use useWeb3Modal() and useWeb3ModalState() hooks in the code, we have to mock the module
          // Otherwise it will complain that createWeb3Modal() is no called before the hooks are used
          { find: /^@reown\/appkit\/react$/, replacement: './playwright/mocks/modules/@reown/appkit/react.js' },

          { find: '/playwright/index.ts', replacement: './playwright/index.ts' },
          { find: '/playwright/envs.js', replacement: './playwright/envs.js' },
        ],
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
