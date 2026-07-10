import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenTransferMock from 'src/slices/token-transfer/mocks';
import { tokenInfoERC20a, tokenInfoERC721a, tokenInfoERC1155a } from 'src/slices/token/mocks/info';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { test, expect } from 'playwright/lib';

import TokenTransfer from './TokenTransfer';

test('erc20 +@mobile', async({ render, mockApiResponse }) => {
  test.slow();
  await mockApiResponse('core:token_transfers', {
    items: [ tokenTransferMock.erc20 ],
    next_page_params: { page_token: 1 },
  }, { pathParams: { hash: tokenInfoERC20a.address_hash } });

  const component = await render(
    <Box pt={{ base: '134px', lg: '100px' }}>
      <TokenTransfer token={ tokenInfoERC20a }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});

test('erc721 +@mobile', async({ render, mockAssetResponse, mockApiResponse }) => {
  test.slow();
  await mockApiResponse('core:token_transfers', {
    items: [ tokenTransferMock.erc721 ],
    next_page_params: { page_token: 1 },
  }, { pathParams: { hash: tokenInfoERC721a.address_hash } });
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <Box pt={{ base: '134px', lg: '100px' }}>
      <TokenTransfer token={ tokenInfoERC721a }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});

test('erc1155 +@mobile', async({ render, mockApiResponse }) => {
  test.slow();
  await mockApiResponse('core:token_transfers', {
    items: [ tokenTransferMock.erc1155A, tokenTransferMock.erc1155B, tokenTransferMock.erc1155C, tokenTransferMock.erc1155D ],
    next_page_params: { page_token: 1 },
  }, { pathParams: { hash: tokenInfoERC1155a.address_hash } });

  const component = await render(
    <Box pt={{ base: '134px', lg: '100px' }}>
      <TokenTransfer token={ tokenInfoERC1155a }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
