import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchesData } from 'mocks/l2txnBatches/txnBatches';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import L2TxnBatches from './L2TxnBatches';

const TXN_BATCHES_API_URL = buildApiUrl('l2_txn_batches');
const TXN_BATCHES_COUNT_API_URL = buildApiUrl('l2_txn_batches_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(TXN_BATCHES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchesData),
  }));

  await page.route(TXN_BATCHES_COUNT_API_URL, (route) => route.fulfill({
    status: 200,
    body: '1235016',
  }));

  const component = await mount(
    <TestApp>
      <L2TxnBatches/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
