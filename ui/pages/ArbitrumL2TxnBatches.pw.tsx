import React from 'react';

import * as arbitrumTxnBatchesMock from 'mocks/arbitrum/txnBatches';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import ArbitrumL2TxnBatches from './ArbitrumL2TxnBatches';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  await mockTextAd();
  await mockApiResponse('arbitrum_l2_txn_batches', arbitrumTxnBatchesMock.baseResponse);
  await mockApiResponse('arbitrum_l2_txn_batches_count', 9927);

  const component = await render(<ArbitrumL2TxnBatches/>);
  await expect(component).toHaveScreenshot();
});
