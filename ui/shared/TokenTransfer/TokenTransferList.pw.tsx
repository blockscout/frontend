import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import { test, expect, devices } from 'playwright/lib';

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

test('without tx info', async({ render }) => {
  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TokenTransferList
        data={ data }
        showTxInfo={ false }
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});

test('with tx info', async({ render }) => {
  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TokenTransferList
        data={ data }
        showTxInfo={ true }
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
