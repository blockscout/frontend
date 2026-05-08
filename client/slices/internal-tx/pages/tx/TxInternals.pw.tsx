import React from 'react';

import * as internalTxsMock from 'client/slices/internal-tx/mocks';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';
import * as txMock from 'client/slices/tx/mocks/tx';

import { test, expect } from 'playwright/lib';

import TxInternals from './TxInternals';

const TX_HASH = txMock.base.hash;
const hooksConfig = {
  router: {
    query: { hash: TX_HASH },
  },
};

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('general:tx_internal_txs', internalTxsMock.baseResponse, { pathParams: { hash: TX_HASH } });
  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;
  const component = await render(<TxInternals txQuery={ txQuery }/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
