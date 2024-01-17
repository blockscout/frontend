import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txStateMock from 'mocks/txs/state';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxState from './TxState';
import type { TxQuery } from './useTxQuery';

const TX_STATE_API_URL = buildApiUrl('tx_state_changes', { hash: txMock.base.hash });
const hooksConfig = {
  router: {
    query: { hash: txMock.base.hash },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(TX_STATE_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txStateMock.baseResponse),
  }));

  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;

  const component = await mount(
    <TestApp>
      <TxState txQuery={ txQuery }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
