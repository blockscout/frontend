import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenBalanceMock from 'mocks/address/tokenBalance';
import TestApp from 'playwright/TestApp';

import TokenSelectDesktop from './TokenSelectDesktop';

const ASSET_URL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/assets/0xb2a90505dc6680a7a695f7975d0d32EeF610f456/logo.png';
const CLIPPING_AREA = { x: 0, y: 0, width: 360, height: 500 };

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

test('base view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <TokenSelectDesktop data={ tokenBalanceMock.baseList }/>
    </TestApp>,
  );
  await page.getByRole('button').click();
  await page.getByText('USD Coin').hover();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test('sort', async({ mount, page }) => {
  await mount(
    <TestApp>
      <TokenSelectDesktop data={ tokenBalanceMock.baseList }/>
    </TestApp>,
  );
  await page.getByRole('button').click();
  await page.locator('a[aria-label="Sort ERC-20 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await page.locator('a[aria-label="Sort ERC-1155 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test('filter', async({ mount, page }) => {
  await mount(
    <TestApp>
      <TokenSelectDesktop data={ tokenBalanceMock.baseList }/>
    </TestApp>,
  );
  await page.getByRole('button').click();
  await page.getByPlaceholder('Search by token name').type('c');

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});
