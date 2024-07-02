import React from 'react';

import { batchData } from 'mocks/arbitrum/txnBatch';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import ArbitrumL2TxnBatch from './ArbitrumL2TxnBatch';

const batchNumber = '5';
const hooksConfig = {
  router: {
    query: { number: batchNumber },
  },
};

test.beforeEach(async({ mockTextAd, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  await mockTextAd();
  await mockApiResponse('arbitrum_l2_txn_batch', batchData, { pathParams: { number: batchNumber } });
});

test('base view', async({ render }) => {
  const component = await render(<ArbitrumL2TxnBatch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', async({ render }) => {
    const component = await render(<ArbitrumL2TxnBatch/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
});
