import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { data as withdrawalsData } from 'mocks/l2withdrawals/withdrawals';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import L2Withdrawals from './L2Withdrawals';

const WITHDRAWALS_API_URL = buildApiUrl('l2_withdrawals');
const WITHDRAWALS_COUNT_API_URL = buildApiUrl('l2_withdrawals_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(WITHDRAWALS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withdrawalsData),
  }));

  await page.route(WITHDRAWALS_COUNT_API_URL, (route) => route.fulfill({
    status: 200,
    body: '397',
  }));

  const component = await mount(
    <TestApp>
      <L2Withdrawals/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
