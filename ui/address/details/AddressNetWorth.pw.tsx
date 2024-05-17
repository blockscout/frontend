import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as tokensMock from 'mocks/address/tokens';
import { test, expect } from 'playwright/lib';
import TestApp from 'playwright/TestApp';

import AddressNetWorth from './AddressNetWorth';

const ADDRESS_HASH = addressMock.hash;
const ICON_URL = 'https://localhost:3000/my-icon.png';

test.beforeEach(async({ mockApiResponse }) => {
  await mockApiResponse('address_tokens', tokensMock.erc20List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-20' } });
  await mockApiResponse('address_tokens', tokensMock.erc721List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-721' } });
  await mockApiResponse('address_tokens', tokensMock.erc1155List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-1155' } });
  await mockApiResponse('address_tokens', tokensMock.erc404List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-404' } });
});

test('base view', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <AddressNetWorth addressData={ addressMock.token } addressHash={ ADDRESS_HASH }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with multichain button internal +@dark-mode', async({ mount, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MULTICHAIN_PROVIDER_CONFIG', `{"name": "duck", "dapp_id": "duck", "url_template": "https://duck.url/{address}", "logo": "${ ICON_URL }"}` ],
  ]);
  await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

  const component = await mount(
    <TestApp>
      <AddressNetWorth addressData={ addressMock.token } addressHash={ ADDRESS_HASH }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with multichain button external', async({ mount, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MULTICHAIN_PROVIDER_CONFIG', `{"name": "duck", "url_template": "https://duck.url/{address}", "logo": "${ ICON_URL }"}` ],
  ]);
  await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

  const component = await mount(
    <TestApp>
      <AddressNetWorth addressData={ addressMock.token } addressHash={ ADDRESS_HASH }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
