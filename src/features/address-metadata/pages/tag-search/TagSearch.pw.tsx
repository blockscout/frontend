// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressesMetadataSearchResult } from 'src/features/address-metadata/types/api';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { test, expect } from 'playwright/lib';

import TagSearch from './TagSearch';

const addresses: AddressesMetadataSearchResult = {
  items: [
    {
      ...addressParamMock.withName,
      transactions_count: '1',
      coin_balance: '12345678901234567890000',
    },
    {
      ...addressParamMock.withEns,
      transactions_count: '109123890123',
      coin_balance: '22222345678901234567890000',
    },
    {
      ...addressParamMock.withoutName,
      transactions_count: '11',
      coin_balance: '1000000000000000000',
    },
    {
      ...addressParamMock.withNameTag,
      transactions_count: '420',
      coin_balance: null,
    },
  ],
  next_page_params: null,
};

const hooksConfig = {
  router: {
    query: {
      slug: 'euler-finance-exploit',
      tagType: 'generic',
      tagName: 'Euler finance exploit',
    },
  },
};

test('base view +@mobile', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse(
    'core:addresses_metadata_search',
    addresses,
    {
      queryParams: {
        slug: 'euler-finance-exploit',
        tag_type: 'generic',
      },
    },
  );
  const component = await render(<TagSearch/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
