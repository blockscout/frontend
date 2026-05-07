import React from 'react';

import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';
import * as txStateChangesMock from 'client/slices/tx/mocks/state-changes';
import * as txMock from 'client/slices/tx/mocks/tx';

import { test, expect } from 'playwright/lib';

import TxState from './TxState';

const hooksConfig = {
  router: {
    query: { hash: txMock.base.hash },
  },
};

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('general:tx_state_changes', txStateChangesMock.baseResponse, { pathParams: { hash: txMock.base.hash } });
  const txQuery = {
    data: txMock.base,
    isPlaceholderData: false,
    isError: false,
  } as TxQuery;
  const component = await render(<TxState txQuery={ txQuery }/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
