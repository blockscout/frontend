import React from 'react';

import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';

import * as addressMock from 'src/slices/address/mocks/address';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as tokensMock from 'src/slices/token/mocks/address-tokens';

import { test, expect } from 'playwright/lib';

import AddressNetWorth from './AddressNetWorth';

const ADDRESS_HASH = addressParamMock.hash;
const ICON_URL = 'https://localhost:3000/my-icon.png';
const ICON_URL_2 = 'https://localhost:3000/my-icon-2.png';

test.beforeEach(async({ mockApiResponse }) => {
  await mockApiResponse('core:address_tokens', tokensMock.erc20List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-20' } });
  await mockApiResponse('core:address_tokens', tokensMock.erc721List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-721' } });
  await mockApiResponse('core:address_tokens', tokensMock.erc1155List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-1155' } });
  await mockApiResponse('core:address_tokens', tokensMock.erc404List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-404' } });
});

test('with multichain buttons +@dark-mode', async({ render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG', JSON.stringify([
      { name: 'Duck portfolio', dapp_id: 'duck', url_template: 'https://duck.url/{address}', logo: ICON_URL },
      { name: 'duck3', dapp_id: 'duck', url_template: 'https://duck.url/{address}', logo: ICON_URL, view: 'icon' },
      { name: 'Goose tracker', url_template: 'https://duck.url/{address}', logo: ICON_URL_2, view: 'full' },
      { name: 'goose', url_template: 'https://duck.url/{address}', logo: ICON_URL_2, view: 'icon' },
    ] satisfies Array<MultichainProviderConfig>) ],
  ]);
  await mockAssetResponse(ICON_URL, './playwright/mocks/duck.png');
  await mockAssetResponse(ICON_URL_2, './playwright/mocks/goose.png');

  const component = await render(<AddressNetWorth addressData={ addressMock.eoa } addressHash={ ADDRESS_HASH }/>);

  await expect(component).toHaveScreenshot();
});
