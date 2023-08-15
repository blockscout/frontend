import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import CsvExport from './CsvExport';

const ADDRESS_API_URL = buildApiUrl('address', { hash: addressMock.hash });
const hooksConfig = {
  router: {
    query: { address: addressMock.hash, type: 'transactions', filterType: 'address', filterValue: 'from' },
    isReady: true,
  },
};

test.beforeEach(async({ page }) => {
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.withName),
  }));
});

test('base view +@mobile +@dark-mode', async({ mount, page }) => {

  const component = await mount(
    <TestApp>
      <CsvExport/>
    </TestApp>,
    { hooksConfig },
  );

  await page.waitForResponse('https://www.google.com/recaptcha/api2/**');

  await expect(component).toHaveScreenshot({
    mask: [ page.locator('.recaptcha') ],
    maskColor: configs.maskColor,
  });
});
