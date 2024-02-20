import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import * as statsLineMock from 'mocks/stats/line';
import * as statsLinesMock from 'mocks/stats/lines';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import GasTracker from './GasTracker';

const STATS_LINES_API_URL = buildApiUrl('stats_lines');
const GAS_PRICE_CHART_API_URL = buildApiUrl('stats_line', { id: 'averageGasPrice' }) + '?**';
const STATS_API_URL = buildApiUrl('stats');

test('base view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ ...statsMock.base, coin_price: '2442.789' }),
  }));
  await page.route(STATS_LINES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsLinesMock.base),
  }));
  await page.route(GAS_PRICE_CHART_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsLineMock.averageGasPrice),
  }));

  const component = await mount(
    <TestApp>
      <GasTracker/>
    </TestApp>,
  );
  await page.waitForResponse(GAS_PRICE_CHART_API_URL);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Averagegasprice-small"]')?.getAttribute('opacity') === '1';
  });

  await expect(component).toHaveScreenshot();
});
