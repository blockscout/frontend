import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenInfoERC721a } from 'mocks/tokens/tokenInfo';
import { base as tokenInstanse } from 'mocks/tokens/tokenInstance';
import TestApp from 'playwright/TestApp';

import TokenInventory from './TokenInventory';

test('base view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 0 }}/>
      <TokenInventory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        inventoryQuery={{
          data: {
            items: [ tokenInstanse, tokenInstanse, tokenInstanse ],
            next_page_params: { unique_token: 1 },
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:
          pagination: { page: 1, isVisible: true },
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        tokenQuery={{
          data: tokenInfoERC721a,
        }}
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
