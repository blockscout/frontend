/* eslint-disable no-console */
import { test as base } from '@playwright/experimental-ct-react';

import * as textAdMock from 'mocks/ad/textAd';

import type { InjectMetaMaskProvider } from './fixtures/injectMetaMaskProvider';
import injectMetaMaskProvider from './fixtures/injectMetaMaskProvider';
import type { MockApiResponseFixture } from './fixtures/mockApiResponse';
import mockApiResponse from './fixtures/mockApiResponse';
import type { MockAssetResponseFixture } from './fixtures/mockAssetResponse';
import mockAssetResponse from './fixtures/mockAssetResponse';
import type { MockConfigResponseFixture } from './fixtures/mockConfigResponse';
import mockConfigResponse from './fixtures/mockConfigResponse';
import type { RenderFixture } from './fixtures/render';
import render from './fixtures/render';
import type { CreateSocketFixture } from './fixtures/socketServer';
import { createSocket } from './fixtures/socketServer';

interface Fixtures {
  render: RenderFixture;
  mockApiResponse: MockApiResponseFixture;
  mockAssetResponse: MockAssetResponseFixture;
  mockConfigResponse: MockConfigResponseFixture;
  createSocket: CreateSocketFixture;
  injectMetaMaskProvider: InjectMetaMaskProvider;
}

const test = base.extend<Fixtures>({
  render,
  mockApiResponse,
  mockAssetResponse,
  mockConfigResponse,
  createSocket,
  injectMetaMaskProvider,
});

test.beforeEach(async({ page }) => {
  // debug
  const isDebug = process.env.PWDEBUG === '1';

  if (isDebug) {
    page.on('console', msg => console.log(msg.text()));
    page.on('request', request => console.info('\x1b[34m%s\x1b[0m', '>>', request.method(), request.url()));
    page.on('response', response => console.info('\x1b[35m%s\x1b[0m', '<<', String(response.status()), response.url()));
  }

  // Abort all other requests to external resources
  await page.route('**', (route) => {
    if (!route.request().url().startsWith('http://localhost')) {
      isDebug && console.info('Aborting request to', route.request().url());
      route.abort();
    } else {
      route.continue();
    }
  });

  // with few exceptions:
  //  1. mock text AD requests
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

export * from '@playwright/experimental-ct-react';
export { test };
