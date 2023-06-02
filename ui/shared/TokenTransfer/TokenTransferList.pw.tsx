import { Box } from '@chakra-ui/react';
import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';

import TokenTransferList from './TokenTransferList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

const data = [
  {
    ...tokenTransferMock.erc20,
    to: {
      ...tokenTransferMock.erc20.to,
      hash: tokenTransferMock.erc721.to.hash,
    },
  },
  tokenTransferMock.erc721,
  tokenTransferMock.erc1155A,
  tokenTransferMock.erc1155B,
  tokenTransferMock.erc1155C,
  tokenTransferMock.erc1155D,
];

test('without tx info', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransferList
        data={ data }
        showTxInfo={ false }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with tx info', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransferList
        data={ data }
        showTxInfo={ true }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
