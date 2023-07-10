import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

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

test('base view +@mobile +@dark-mode', async({ mount }) => {

  const component = await mount(
    <TestApp>
      <CsvExport/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
