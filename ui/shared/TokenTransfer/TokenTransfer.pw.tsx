import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';

import TokenTransfer from './TokenTransfer';

const API_URL = '/node-api/transactions/1/token-transfers';

test('without tx info +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenTransferMock.mixTokens),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransfer
        resourceName="tx_token_transfers"
        pathParams={{ id: '1' }}
        showTxInfo={ false }
      />
    </TestApp>,
  );

  await page.waitForResponse(API_URL),

  await expect(component).toHaveScreenshot();
});

test('with tx info +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenTransferMock.mixTokens),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransfer
        resourceName="tx_token_transfers"
        pathParams={{ id: '1' }}
        showTxInfo={ true }
      />
    </TestApp>,
  );

  await page.waitForResponse(API_URL),

  await expect(component).toHaveScreenshot();
});
