import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as internalTxsMock from 'mocks/txs/internalTxs';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';

import TxInternals from './TxInternals';

const TX_HASH = txMock.base.hash;
const API_URL_TX = `/node-api/transactions/${ TX_HASH }`;
const API_URL_TX_INTERNALS = `/node-api/transactions/${ TX_HASH }/internal-transactions`;
const hooksConfig = {
  router: {
    query: { id: TX_HASH },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL_TX, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.base),
  }));
  await page.route(API_URL_TX_INTERNALS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(internalTxsMock.baseResponse),
  }));

  const component = await mount(
    <TestApp>
      <TxInternals/>
    </TestApp>,
    { hooksConfig },
  );

  await page.waitForResponse(API_URL_TX),
  await page.waitForResponse(API_URL_TX_INTERNALS),

  await expect(component).toHaveScreenshot();
});
