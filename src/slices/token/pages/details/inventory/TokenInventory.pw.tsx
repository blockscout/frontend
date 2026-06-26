import { Box } from '@chakra-ui/react';
import React from 'react';

import { tokenInfoERC721a } from 'src/slices/token/mocks/info';
import { base as tokenInstance } from 'src/slices/token/mocks/instance';

import { test, expect } from 'playwright/lib';

import TokenInventory from './TokenInventory';

test('base view +@mobile', async({ render, mockAssetResponse }) => {

  await mockAssetResponse(tokenInstance.image_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <Box pt={{ base: '134px', lg: 0 }}>
      <TokenInventory

        // @ts-ignore:
        inventoryQuery={{
          data: {
            items: [
              { ...tokenInstance, token_type: 'ERC-721' },
              { ...tokenInstance, image_url: null, token_type: 'ERC-721' },
              { ...tokenInstance, image_url: null, token_type: 'ERC-721' },
            ],
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
