import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats';
import * as txsStatsMock from 'mocks/txs/stats';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxsStats from './TxsStats';

const TXS_STATS_API_URL = buildApiUrl('txs_stats');
const STATS_API_URL = buildApiUrl('stats');

test('base view +@mobile', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(TXS_STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txsStatsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <TxsStats/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
