import React from 'react';

import * as blobsMock from 'mocks/blobs/blobs';
import { test, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import Blob from './Blob';

const hooksConfig = {
  router: {
    query: { hash: blobsMock.base1.hash },
  },
};

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test('base view +@mobile +@dark-mode', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('blob', blobsMock.base1, { pathParams: { hash: blobsMock.base1.hash } });
  const component = await render(<Blob/>, { hooksConfig });
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('without data', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('blob', blobsMock.withoutData, { pathParams: { hash: blobsMock.base1.hash } });
  const component = await render(<Blob/>, { hooksConfig });
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
