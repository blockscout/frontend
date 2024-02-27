import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as internalTxsMock from 'mocks/txs/internalTxs';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxInternals from './TxInternals';
import type { TxQuery } from './useTxQuery';

const TX_HASH = txMock.base.hash;
const API_URL_TX_INTERNALS = buildApiUrl('tx_internal_txs', { hash: TX_HASH });
const hooksConfig = {
  router: {
    query: { hash: TX_HASH },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL_TX_INTERNALS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(internalTxsMock.baseResponse),
  }));

  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;

  const component = await mount(
    <TestApp>
      <TxInternals txQuery={ txQuery }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
