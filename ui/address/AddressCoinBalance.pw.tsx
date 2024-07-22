import React from 'react';

import * as balanceHistoryMock from 'mocks/address/coinBalanceHistory';
import { test, expect } from 'playwright/lib';

import AddressCoinBalance from './AddressCoinBalance';

const addressHash = '0x1234';
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('base view +@dark-mode +@mobile', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('address_coin_balance', balanceHistoryMock.baseResponse, { pathParams: { hash: addressHash } });
  await mockApiResponse('address_coin_balance_chart', balanceHistoryMock.chartResponse, { pathParams: { hash: addressHash } });
  const component = await render(<AddressCoinBalance/>, { hooksConfig });
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Balances-small"]')?.getAttribute('opacity') === '1';
  });
  await page.mouse.move(100, 100);
  await page.mouse.move(240, 100);
  await expect(component).toHaveScreenshot();
});
