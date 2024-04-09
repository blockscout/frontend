import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blobsMock from 'mocks/blobs/blobs';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxBlobs from './TxBlobs';
import type { TxQuery } from './useTxQuery';

const TX_BLOBS_API_URL = buildApiUrl('tx_blobs', { hash: txMock.base.hash });
const hooksConfig = {
  router: {
    query: { hash: txMock.base.hash },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(TX_BLOBS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blobsMock.txBlobs),
  }));

  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;

  const component = await mount(
    <TestApp>
      <TxBlobs txQuery={ txQuery }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
