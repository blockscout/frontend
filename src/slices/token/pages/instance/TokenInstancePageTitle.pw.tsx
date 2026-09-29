import React from 'react';

import { tokenInfoERC721a } from 'src/slices/token/mocks/info';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { generateAddressMetadataInfo, hiddenProtocolTagWithMeta } from 'src/features/address-metadata/mocks/tags';

import config from 'src/config';

import { test, expect } from 'playwright/lib';

import TokenInstancePageTitle from './TokenInstancePageTitle';

const hash = tokenInfoERC721a.address_hash;

const addressMetadataQueryParams = {
  addresses: [ hash ],
  chainId: config.chain.id,
  tagsLimit: '20',
};

test('with action button +@dark-mode +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('metadata:info', generateAddressMetadataInfo(hash, hiddenProtocolTagWithMeta), { queryParams: addressMetadataQueryParams });
  await mockAssetResponse(hiddenProtocolTagWithMeta.meta?.appLogoURL as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <TokenInstancePageTitle
      isLoading={ false }
      token={ tokenInfoERC721a }
      instance={ tokenInstanceMock.unique }
      hash={ hash }
    />,
  );

  await expect(component.getByRole('link', { name: /Buy on Duck portal/ })).toHaveAttribute(
    'href',
    `https://portal.duck.io/swap?chainId=${ config.chain.id }&token=${ hash.toLowerCase() }&utm_source=blockscout&utm_medium=token`,
  );
  await expect(component).toHaveScreenshot();
});
