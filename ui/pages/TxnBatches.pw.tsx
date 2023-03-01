import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchesData } from 'mocks/txnBatches/txnBatches';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxnBatches from './TxnBatches';

const TXN_BATCHES_API_URL = buildApiUrl('txn_batches');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(TXN_BATCHES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchesData),
  }));

  const component = await mount(
    <TestApp>
      <TxnBatches/>
    </TestApp>,
  );

  await expect(component.locator('main')).toHaveScreenshot();
});
