import React from 'react';

import * as statsMock from 'mocks/stats/index';
import * as statsLineMock from 'mocks/stats/line';
import * as statsLinesMock from 'mocks/stats/lines';
import { test, expect } from 'playwright/lib';

import GasTracker from './GasTracker';

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test('base view +@dark-mode +@mobile', async({ render, mockApiResponse, mockEnvs, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED', 'true' ],
  ]);
  await mockApiResponse('stats', { ...statsMock.base, coin_price: '2442.789' });
  await mockApiResponse('stats_lines', statsLinesMock.base);
  const chartApiUrl = await mockApiResponse(
    'stats_line',
    statsLineMock.averageGasPrice,
    { pathParams: { id: 'averageGasPrice' }, queryParams: { from: '**' } },
  );
  const component = await render(<GasTracker/>);
  await page.waitForResponse(chartApiUrl);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Averagegasprice-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});
