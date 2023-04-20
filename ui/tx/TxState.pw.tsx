import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txStateMock from 'mocks/txs/state';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TxState from './TxState';

const TX_INFO_API_URL = buildApiUrl('tx', { hash: txMock.base.hash });
const TX_STATE_API_URL = buildApiUrl('tx_state_changes', { hash: txMock.base.hash });
const hooksConfig = {
  router: {
    query: { hash: txMock.base.hash },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(TX_INFO_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.base),
  }));
  await page.route(TX_STATE_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txStateMock.baseResponse),
  }));

  const component = await mount(
    <TestApp>
      <TxState/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
