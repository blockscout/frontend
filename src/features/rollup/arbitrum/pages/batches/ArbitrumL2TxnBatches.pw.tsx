import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import * as arbitrumTxnBatchesMock from '../../mocks/txn-batches';
import ArbitrumL2TxnBatches from './ArbitrumL2TxnBatches';

test('base view', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  await mockTextAd();
  await mockApiResponse('core:arbitrum_l2_txn_batches', arbitrumTxnBatchesMock.baseResponse);
  await mockApiResponse('core:arbitrum_l2_txn_batches_count', 9927);

  const component = await render(<ArbitrumL2TxnBatches/>);
  await expect(component).toHaveScreenshot();
});
