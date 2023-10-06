import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { txnBatchesData } from 'mocks/zkevmL2txnBatches/zkevmL2txnBatches';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import LatestZkEvmL2Batches from './LatestZkEvmL2Batches';

const BATCHES_API_URL = buildApiUrl('homepage_zkevm_l2_batches');

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(BATCHES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txnBatchesData),
  }));

  const component = await mount(
    <TestApp>
      <LatestZkEvmL2Batches/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
