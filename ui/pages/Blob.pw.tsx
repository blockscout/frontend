import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

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
