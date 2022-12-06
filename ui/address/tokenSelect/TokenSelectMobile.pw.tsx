import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenBalanceMock from 'mocks/address/tokenBalance';
import TestApp from 'playwright/TestApp';

import TokenSelectMobile from './TokenSelectMobile';

const ASSET_URL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/assets/0xb2a90505dc6680a7a695f7975d0d32EeF610f456/logo.png';

const test = base.extend({
  page: async({ page }, use) => {
    await page.route(ASSET_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });
    use(page);
  },
});
test.use(devices['iPhone 13 Pro']);

test('base view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <TokenSelectMobile data={ tokenBalanceMock.baseList }/>
    </TestApp>,
  );
  await page.getByRole('button').click();
  await page.getByText('USD Coin').hover();

  await expect(page).toHaveScreenshot();
});
