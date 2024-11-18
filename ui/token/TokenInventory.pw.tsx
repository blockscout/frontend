import { Box } from '@chakra-ui/react';
import React from 'react';

import { tokenInfoERC721a } from 'mocks/tokens/tokenInfo';
import { base as tokenInstanse } from 'mocks/tokens/tokenInstance';
import { test, expect } from 'playwright/lib';

import TokenInventory from './TokenInventory';

test('base view +@mobile', async({ render }) => {
  const component = await render(
    <Box pt={{ base: '134px', lg: 0 }}>
      <TokenInventory

        // @ts-ignore:
        inventoryQuery={{
          data: {
            items: [ tokenInstanse, tokenInstanse, tokenInstanse ],
            next_page_params: { unique_token: 1 },
          },

          // @ts-ignore:
          pagination: { page: 1, isVisible: true },
        }}

        // @ts-ignore:
        tokenQuery={{
          data: tokenInfoERC721a,
        }}
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
