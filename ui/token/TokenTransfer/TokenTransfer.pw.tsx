import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';

import TokenTransfer from './TokenTransfer';

test('erc20 +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: '100px' }}/>
      <TokenTransfer
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [ tokenTransferMock.erc20 ],
            next_page_params: null,
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1, isVisible: true },
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [ tokenTransferMock.erc721 ],
            next_page_params: null,
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1, isVisible: true },
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        transfersQuery={{
          data: {
            items: [
              tokenTransferMock.erc1155A,
              tokenTransferMock.erc1155B,
              tokenTransferMock.erc1155C,
              tokenTransferMock.erc1155D,
            ],
            next_page_params: null,
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1, isVisible: true },
        }}
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
