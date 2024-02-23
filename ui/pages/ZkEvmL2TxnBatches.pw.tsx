import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchesData } from 'mocks/zkevmL2txnBatches/zkevmL2txnBatches';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import ZkEvmL2TxnBatches from './ZkEvmL2TxnBatches';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.zkEvmRollup) as any,
});

const BATCHES_API_URL = buildApiUrl('zkevm_l2_txn_batches');
const BATCHES_COUNTERS_API_URL = buildApiUrl('zkevm_l2_txn_batches_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(BATCHES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchesData),
  }));

  await page.route(BATCHES_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: '9927',
  }));

  const component = await mount(
    <TestApp>
      <ZkEvmL2TxnBatches/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
