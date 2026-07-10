import React from 'react';

import { tokenInfoERC721a } from 'src/slices/token/mocks/info';
import { base as tokenInstance } from 'src/slices/token/mocks/instance';

import { test, expect } from 'playwright/lib';

import TokenInventory from './TokenInventory';

test('base view +@mobile', async({ render, mockAssetResponse, mockApiResponse }) => {

  await mockApiResponse('core:token_inventory', {
    items: [
      { ...tokenInstance, token_type: 'ERC-721' },
      { ...tokenInstance, image_url: null, token_type: 'ERC-721' },
      { ...tokenInstance, image_url: null, token_type: 'ERC-721' },
    ],
    next_page_params: { unique_token: 1 },
  }, {
    pathParams: { hash: tokenInfoERC721a.address_hash },
    queryParams: { holder_address_hash: tokenInfoERC721a.address_hash },
  });
  await mockAssetResponse(tokenInstance.image_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <TokenInventory
      hash={ tokenInfoERC721a.address_hash }
      token={ tokenInfoERC721a }
      ownerFilter={ tokenInfoERC721a.address_hash }
    />,
  );

  await expect(component).toHaveScreenshot();
});
