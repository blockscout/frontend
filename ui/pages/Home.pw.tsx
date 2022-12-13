import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import * as txMock from 'mocks/txs/tx';
import insertAdText from 'playwright/scripts/insertAdText';
import TestApp from 'playwright/TestApp';

import Home from './Home';

test('default view -@default +@desktop-xl +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route('/node-api/home-stats', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route('/node-api/index/blocks', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      blockMock.base,
      blockMock.base2,
    ]),
  }));
  await page.route('/node-api/index/txs', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]),
  }));
  await page.route('/node-api/home-stats/charts/transactions', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(dailyTxsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <Home/>
    </TestApp>,
  );

  await page.evaluate(insertAdText);

  await expect(component).toHaveScreenshot();
});
