import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { data as depositsData } from 'mocks/l2deposits/deposits';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import L2Deposits from './L2Deposits';

const DEPOSITS_API_URL = buildApiUrl('l2_deposits');
const DEPOSITS_COUNT_API_URL = buildApiUrl('l2_deposits_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(DEPOSITS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(depositsData),
  }));

  await page.route(DEPOSITS_COUNT_API_URL, (route) => route.fulfill({
    status: 200,
    body: '3971111',
  }));

  const component = await mount(
    <TestApp>
      <L2Deposits/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
