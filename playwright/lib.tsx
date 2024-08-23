import { test as base } from '@playwright/experimental-ct-react';

import * as injectMetaMaskProvider from './fixtures/injectMetaMaskProvider';
import * as mockApiResponse from './fixtures/mockApiResponse';
import * as mockAssetResponse from './fixtures/mockAssetResponse';
import * as mockConfigResponse from './fixtures/mockConfigResponse';
import * as mockEnvs from './fixtures/mockEnvs';
import * as mockFeatures from './fixtures/mockFeatures';
import * as mockTextAd from './fixtures/mockTextAd';
import * as render from './fixtures/render';
import * as socketServer from './fixtures/socketServer';

interface Fixtures {
  render: render.RenderFixture;
  mockApiResponse: mockApiResponse.MockApiResponseFixture;
  mockAssetResponse: mockAssetResponse.MockAssetResponseFixture;
  mockConfigResponse: mockConfigResponse.MockConfigResponseFixture;
  mockEnvs: mockEnvs.MockEnvsFixture;
  mockFeatures: mockFeatures.MockFeaturesFixture;
  createSocket: socketServer.CreateSocketFixture;
  injectMetaMaskProvider: injectMetaMaskProvider.InjectMetaMaskProvider;
  mockTextAd: mockTextAd.MockTextAdFixture;
}

const test = base.extend<Fixtures>({
  render: render.default,
  mockApiResponse: mockApiResponse.default,
  mockAssetResponse: mockAssetResponse.default,
  mockConfigResponse: mockConfigResponse.default,
  mockEnvs: mockEnvs.default,
  mockFeatures: mockFeatures.default,
  // FIXME: for some reason Playwright does not intercept requests to text ad provider when running multiple tests in parallel
  // even if we have a global request interceptor (maybe it is related to service worker issue, maybe not)
  // so we have to inject mockTextAd fixture in each test and mock the response where it is needed
  mockTextAd: mockTextAd.default,
  createSocket: socketServer.createSocket,
  injectMetaMaskProvider: injectMetaMaskProvider.default,
});

test.beforeEach(async({ page, mockTextAd }) => {

  // Abort all other requests to external resources
  await page.route('**', (route) => {
    if (!route.request().url().startsWith('http://localhost')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  // with few exceptions:
  //  1. mock text AD requests
  await mockTextAd();
});

export * from '@playwright/experimental-ct-react';
export { test };
