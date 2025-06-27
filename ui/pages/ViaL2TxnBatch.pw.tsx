import React from 'react';

import * as viaTxnBatchMock from 'mocks/via/viaTxnBatch';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import ViaL2TxnBatch from './ViaL2TxnBatch';

const batchNumber = String(viaTxnBatchMock.base.number);
const hooksConfig = {
  router: {
    query: { number: batchNumber },
  },
};

test.beforeEach(async({ mockTextAd, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.viaRollup);
  await mockTextAd();
  await mockApiResponse('general:via_l2_txn_batch', viaTxnBatchMock.base, { pathParams: { number: batchNumber } });
});

test('base view', async({ render }) => {
  const component = await render(<ViaL2TxnBatch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', async({ render }) => {
    const component = await render(<ViaL2TxnBatch/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });
});
