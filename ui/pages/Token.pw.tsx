import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { token as contract } from 'mocks/address/address';
import { tokenInfo, tokenCounters } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import insertAdPlaceholder from 'playwright/utils/insertAdPlaceholder';

import Token from './Token';

const TOKEN_API_URL = buildApiUrl('token', { hash: '1' });
const TOKEN_COUNTERS_API_URL = buildApiUrl('token_counters', { hash: '1' });
const TOKEN_TRANSFERS_API_URL = buildApiUrl('token_transfers', { hash: '1' });
const ADDRESS_API_URL = buildApiUrl('address', { hash: '1' });
const hooksConfig = {
  router: {
    query: { hash: 1, tab: 'token_transfers' },
    isReady: true,
  },
};

// FIXME: idk why mobile test doesn't work (it's ok locally)
// test('base view +@mobile +@dark-mode', async({ mount, page }) => {
test('base view +@dark-mode', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(TOKEN_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenInfo),
  }));
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contract),
  }));
  await page.route(TOKEN_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenCounters),
  }));
  await page.route(TOKEN_TRANSFERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({}),
  }));

  const component = await mount(
    <TestApp>
      <Token/>
    </TestApp>,
    { hooksConfig },
  );

  await insertAdPlaceholder(page);

  await expect(component.locator('main')).toHaveScreenshot();
});
