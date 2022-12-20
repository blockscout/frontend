import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as internalTxsMock from 'mocks/txs/internalTxs';
import TestApp from 'playwright/TestApp';

import AddressInternalTxs from './AddressInternalTxs';

const ADDRESS_HASH = internalTxsMock.base.from.hash;
const API_URL_TX_INTERNALS = `/node-api/addresses/${ ADDRESS_HASH }/internal-transactions`;
const hooksConfig = {
  router: {
    query: { id: ADDRESS_HASH },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL_TX_INTERNALS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(internalTxsMock.baseResponse),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressInternalTxs/>
    </TestApp>,
    { hooksConfig },
  );

  await page.waitForResponse(API_URL_TX_INTERNALS),

  await expect(component).toHaveScreenshot();
});
