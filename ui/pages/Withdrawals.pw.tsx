import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { data as withdrawalsData } from 'mocks/withdrawals/withdrawals';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import Withdrawals from './Withdrawals';

const WITHDRAWALS_API_URL = buildApiUrl('withdrawals');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(WITHDRAWALS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withdrawalsData),
  }));

  const component = await mount(
    <TestApp>
      <Withdrawals/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
