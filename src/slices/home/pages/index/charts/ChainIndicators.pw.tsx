import type { Locator } from '@playwright/test';
import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';
import * as dailyTxsMock from 'src/slices/home/mocks/charts';

import { test, expect } from 'playwright/lib';

import ChainIndicators from './ChainIndicators';

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_CHARTS', '["daily_txs","coin_price","secondary_coin_price","market_cap","tvl"]' ],
    [ 'NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL', 'DUCK' ],
    [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
  ]);
});

test.describe('daily txs chart', () => {
  let component: Locator;

  test.beforeEach(async({ page, mockApiResponse, mockAssetResponse, render }) => {
    await mockApiResponse('core:stats', statsMock.withSecondaryCoin);
    await mockApiResponse('core:stats_charts_txs', dailyTxsMock.base);
    await mockAssetResponse(statsMock.withSecondaryCoin.coin_image as string, './playwright/mocks/image_svg.svg');
    await mockAssetResponse(statsMock.withSecondaryCoin.secondary_coin_image as string, './playwright/mocks/image_s.jpg');
    component = await render(<ChainIndicators/>);
    await page.waitForFunction(() => {
      return document.querySelector('path[data-name="daily_txs"]')?.getAttribute('opacity') === '1';
    });
    await page.hover('.ChartOverlay', { position: { x: 50, y: 50 } });
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

test('partial data', async({ page, mockApiResponse, mockAssetResponse, render }) => {
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:stats_charts_txs', dailyTxsMock.partialData);
  await mockAssetResponse(statsMock.base.coin_image as string, './playwright/mocks/image_s.jpg');

  const component = await render(<ChainIndicators/>);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="daily_txs"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});

test('no data', async({ mockApiResponse, mockAssetResponse, render }) => {
  await mockApiResponse('core:stats', statsMock.noChartData);
  await mockApiResponse('core:stats_charts_txs', dailyTxsMock.noData);
  await mockAssetResponse(statsMock.noChartData.coin_image as string, './playwright/mocks/image_s.jpg');

  const component = await render(<ChainIndicators/>);
  await expect(component).toHaveScreenshot();
});
