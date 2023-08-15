import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { data as withdrawalsData } from 'mocks/withdrawals/withdrawals';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Withdrawals from './Withdrawals';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.beaconChain) as any,
});

const WITHDRAWALS_API_URL = buildApiUrl('withdrawals');
const WITHDRAWALS_COUNTERS_API_URL = buildApiUrl('withdrawals_counters');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(WITHDRAWALS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withdrawalsData),
  }));

  await page.route(WITHDRAWALS_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ withdrawal_count: '111111', withdrawal_sum: '1010101010110101001101010' }),
  }));

  const component = await mount(
    <TestApp>
      <Withdrawals/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
