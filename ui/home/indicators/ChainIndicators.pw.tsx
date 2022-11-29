import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import TestApp from 'playwright/TestApp';

import ChainIndicators from './ChainIndicators';

const STATS_API_URL = '/node-api/stats';
const TX_CHART_API_URL = '/node-api/stats/charts/transactions';

test('daily txs chart +@mobile +@dark-mode +@dark-mode-mobile', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(TX_CHART_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(dailyTxsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <ChainIndicators/>
    </TestApp>,
  );
  await page.waitForResponse(STATS_API_URL),
  await page.hover('.ChartOverlay', { position: { x: 100, y: 100 } });

  await expect(component).toHaveScreenshot();
});
