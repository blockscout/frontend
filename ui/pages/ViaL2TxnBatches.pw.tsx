import React from 'react';

import * as viaTxnBatchesMock from 'mocks/via/viaTxnBatches';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import ViaL2TxnBatches from './ViaL2TxnBatches';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.viaRollup);
  await mockTextAd();
  await mockApiResponse('general:via_l2_txn_batches', viaTxnBatchesMock.baseResponse);
  await mockApiResponse('general:via_l2_txn_batches_count', 9927);

  const component = await render(<ViaL2TxnBatches/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
