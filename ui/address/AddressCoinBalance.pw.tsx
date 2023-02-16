import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as balanceHistoryMock from 'mocks/address/coinBalanceHistory';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressCoinBalance from './AddressCoinBalance';

const addressHash = 'hash';
const BALANCE_HISTORY_API_URL = buildApiUrl('address_coin_balance', { hash: addressHash });
const BALANCE_HISTORY_CHART_API_URL = buildApiUrl('address_coin_balance_chart', { hash: addressHash });
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('base view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route(BALANCE_HISTORY_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(balanceHistoryMock.baseResponse),
  }));
  await page.route(BALANCE_HISTORY_CHART_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(balanceHistoryMock.chartResponse),
  }));

  const component = await mount(
    <TestApp>
      <AddressCoinBalance/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Balances-small"]')?.getAttribute('opacity') === '1';
  });
  await page.mouse.move(240, 100);

  await expect(component).toHaveScreenshot();
});
