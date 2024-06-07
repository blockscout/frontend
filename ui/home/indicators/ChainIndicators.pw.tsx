import type { Locator } from '@playwright/test';
import React from 'react';

import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';

import ChainIndicators from './ChainIndicators';

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_CHARTS', '["daily_txs","coin_price","secondary_coin_price","market_cap","tvl"]' ],
    [ 'NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL', 'DUCK' ],
  ]);
});

test.describe('daily txs chart', () => {
  let component: Locator;

  test.beforeEach(async({ page, mockApiResponse, mockAssetResponse, render }) => {
    await mockApiResponse('stats', statsMock.withSecondaryCoin);
    await mockApiResponse('stats_charts_txs', dailyTxsMock.base);
    await mockAssetResponse(statsMock.withSecondaryCoin.coin_image as string, './playwright/mocks/image_svg.svg');
    component = await render(<ChainIndicators/>);
    await page.hover('.ChartOverlay', { position: { x: 100, y: 100 } });
  });

  test('+@mobile', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('dark mode', () => {
    test.use({ colorScheme: 'dark' });

    test('+@mobile', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

test('partial data', async({ page, mockApiResponse, render }) => {
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('stats_charts_txs', dailyTxsMock.partialData);
  const component = await render(<ChainIndicators/>);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="gradient-chart-area"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});

test('no data', async({ mockApiResponse, render }) => {
  await mockApiResponse('stats', statsMock.noChartData);
  await mockApiResponse('stats_charts_txs', dailyTxsMock.noData);
  const component = await render(<ChainIndicators/>);
  await expect(component).toHaveScreenshot();
});
