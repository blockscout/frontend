import { test as base, expect } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import React from 'react';

import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ChainIndicators from './ChainIndicators';

const STATS_API_URL = buildApiUrl('homepage_stats');
const TX_CHART_API_URL = buildApiUrl('homepage_chart_txs');

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_HOMEPAGE_CHARTS', value: '["daily_txs","coin_price","market_cap","tvl"]' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test.describe('daily txs chart', () => {
  let component: Locator;

  test.beforeEach(async({ page, mount }) => {
    await page.route(STATS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));
    await page.route(TX_CHART_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(dailyTxsMock.base),
    }));

    component = await mount(
      <TestApp>
        <ChainIndicators/>
      </TestApp>,
    );
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
