import React from 'react';

import * as addressMock from 'mocks/address/address';
import { tokenInfoERC721a } from 'mocks/tokens/tokenInfo';
import * as tokenInstanceMock from 'mocks/tokens/tokenInstance';
import { test, expect } from 'playwright/lib';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TokenInstanceDetails from './TokenInstanceDetails';

const hash = tokenInfoERC721a.address;

test('base view +@dark-mode +@mobile', async({ render, page, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('address', addressMock.contract, { pathParams: { hash } });
  await mockApiResponse('token_instance_transfers_count', { transfers_count: 42 }, { pathParams: { id: tokenInstanceMock.unique.id, hash } });
  await mockAssetResponse('http://localhost:3000/nft-marketplace-logo.png', './playwright/mocks/image_s.jpg');

  const component = await render(
    <TestApp>
      <TokenInstanceDetails data={ tokenInstanceMock.unique } token={ tokenInfoERC721a }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
