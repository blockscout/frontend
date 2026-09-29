import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';

import type { ResourceError } from 'src/api/resources';

import { tokenInfo } from 'src/slices/token/mocks/info';

import { generateAddressMetadataInfo, hiddenProtocolTagWithMeta } from 'src/features/address-metadata/mocks/tags';

import config from 'src/config';

import { test, expect } from 'playwright/lib';

import TokenPageTitle from './TokenPageTitle';

const hash = tokenInfo.address_hash;

const tokenQuery = {
  data: tokenInfo,
} as UseQueryResult<schemas['Token'], ResourceError<unknown>>;

const verifiedInfoQuery = {
  data: {},
} as UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;

const addressQuery = {} as UseQueryResult<schemas['Address'], ResourceError<unknown>>;

const addressMetadataQueryParams = {
  addresses: [ hash ],
  chainId: config.chain.id,
  tagsLimit: '20',
};

test('with action button +@dark-mode +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('metadata:info', generateAddressMetadataInfo(hash, hiddenProtocolTagWithMeta), { queryParams: addressMetadataQueryParams });
  await mockAssetResponse(hiddenProtocolTagWithMeta.meta?.appLogoURL as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <TokenPageTitle
      tokenQuery={ tokenQuery }
      hash={ hash }
      addressQuery={ addressQuery }
      verifiedInfoQuery={ verifiedInfoQuery }
    />);

  await expect(component.getByRole('link', { name: /Buy on Duck portal/ })).toHaveAttribute(
    'href',
    `https://portal.duck.io/swap?chainId=${ config.chain.id }&token=${ hash.toLowerCase() }&utm_source=blockscout&utm_medium=token`,
  );
  await expect(component.getByText('Buy on Duck portal', { exact: true })).toHaveCount(1);
  await expect(component).toHaveScreenshot();
});
