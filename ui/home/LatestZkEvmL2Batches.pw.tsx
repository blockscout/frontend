import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchesData } from 'mocks/zkevmL2txnBatches/zkevmL2txnBatches';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import LatestZkEvmL2Batches from './LatestZkEvmL2Batches';

const BATCHES_API_URL = buildApiUrl('homepage_zkevm_l2_batches');

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.zkRollup) as any,
});

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(BATCHES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchesData),
  }));

  const component = await mount(
    <TestApp>
      <LatestZkEvmL2Batches/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
