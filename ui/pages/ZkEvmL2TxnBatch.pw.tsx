import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchData } from 'mocks/zkevmL2txnBatches/zkevmL2txnBatch';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import ZkEvmL2TxnBatch from './ZkEvmL2TxnBatch';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.zkEvmRollup) as any,
});

const hooksConfig = {
  router: {
    query: { number: '5' },
  },
};

const BATCH_API_URL = buildApiUrl('zkevm_l2_txn_batch', { number: '5' });

test('base view', async({ mount, page }) => {
  test.slow();
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(BATCH_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchData),
  }));

  const component = await mount(
    <TestApp>
      <ZkEvmL2TxnBatch/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', async({ mount, page }) => {
    test.slow();
    await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
      status: 200,
      body: '',
    }));

    await page.route(BATCH_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(txnBatchData),
    }));

    const component = await mount(
      <TestApp>
        <ZkEvmL2TxnBatch/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
