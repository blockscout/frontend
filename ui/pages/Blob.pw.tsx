import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import * as blobsMock from 'mocks/blobs/blobs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Blob from './Blob';

const BLOB_API_URL = buildApiUrl('blob', { hash: blobsMock.base1.hash });
const hooksConfig = {
  router: {
    query: { hash: blobsMock.base1.hash },
  },
};

test.beforeEach(async({ page }) => {
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

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(BLOB_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blobsMock.base1),
  }));

  const component = await mount(
    <TestApp>
      <Blob/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('without data', async({ mount, page }) => {
  await page.route(BLOB_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blobsMock.withoutData),
  }));

  const component = await mount(
    <TestApp>
      <Blob/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
