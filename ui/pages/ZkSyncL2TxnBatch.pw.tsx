import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as zkSyncTxnBatchMock from 'mocks/zkSync/zkSyncTxnBatch';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import ZkSyncL2TxnBatch from './ZkSyncL2TxnBatch';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.zkSyncRollup) as any,
});

const hooksConfig = {
  router: {
    query: { number: String(zkSyncTxnBatchMock.base.number) },
  },
};

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(BATCH_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(zkSyncTxnBatchMock.base),
  }));
});

const BATCH_API_URL = buildApiUrl('zksync_l2_txn_batch', { number: String(zkSyncTxnBatchMock.base.number) });

test('base view', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <ZkSyncL2TxnBatch/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <ZkSyncL2TxnBatch/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
