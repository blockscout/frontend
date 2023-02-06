import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenInfo } from 'mocks/tokens/tokenInfo';
import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';

import TokenTransfer from './TokenTransfer';

test('erc20 +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: '100px' }}/>
      <TokenTransfer
        token={ tokenInfo }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [ tokenTransferMock.erc20 ],
            next_page_params: null,
          },
          isPaginationVisible: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1 },
        }}
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('erc721 +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: '100px' }}/>
      <TokenTransfer
        token={{ ...tokenInfo, type: 'ERC-721' }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [ tokenTransferMock.erc721 ],
            next_page_params: null,
          },
          isPaginationVisible: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1 },
        }}
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('erc1155 +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: '100px' }}/>
      <TokenTransfer
        token={{ ...tokenInfo, type: 'ERC-1155', symbol: tokenTransferMock.erc1155multiple.token.symbol }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [ tokenTransferMock.erc1155, tokenTransferMock.erc1155multiple ],
            next_page_params: null,
          },
          isPaginationVisible: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1 },
        }}
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
