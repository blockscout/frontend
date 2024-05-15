import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as countersMock from 'mocks/address/counters';
import * as tokensMock from 'mocks/address/tokens';
import { test, expect, devices } from 'playwright/lib';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import AddressDetails from './AddressDetails';
import MockAddressPage from './testUtils/MockAddressPage';
import type { AddressQuery } from './utils/useAddressQuery';

const ADDRESS_HASH = addressMock.hash;
const hooksConfig = {
  router: {
    query: { hash: ADDRESS_HASH },
  },
};

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('contract', async({ mount, page, mockApiResponse }) => {
    await mockApiResponse('address', addressMock.contract, { pathParams: { hash: ADDRESS_HASH } });
    await mockApiResponse('address_counters', countersMock.forContract, { pathParams: { hash: ADDRESS_HASH } });

    const component = await mount(
      <TestApp>
        <AddressDetails addressQuery={{ data: addressMock.contract } as AddressQuery}/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });

  test('validator', async({ mount, page, mockApiResponse }) => {
    await mockApiResponse('address', addressMock.validator, { pathParams: { hash: ADDRESS_HASH } });
    await mockApiResponse('address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

    const component = await mount(
      <TestApp>
        <AddressDetails addressQuery={{ data: addressMock.validator } as AddressQuery}/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });
});

test('contract', async({ mount, page, mockApiResponse }) => {
  await mockApiResponse('address', addressMock.contract, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('address_counters', countersMock.forContract, { pathParams: { hash: ADDRESS_HASH } });

  const component = await mount(
    <TestApp>
      <AddressDetails addressQuery={{ data: addressMock.contract } as AddressQuery}/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('token', async({ mount, page, mockApiResponse, injectMetaMaskProvider }) => {
  await mockApiResponse('address', addressMock.token, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('address_counters', countersMock.forToken, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse(
    'address_tokens',
    { ...tokensMock.erc20List, next_page_params: null },
    { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-20' } },
    1,
  );
  await mockApiResponse(
    'address_tokens',
    { ...tokensMock.erc721List, next_page_params: null },
    { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-721' } },
    1,
  );
  await mockApiResponse(
    'address_tokens',
    { ...tokensMock.erc1155List, next_page_params: null },
    { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-1155' } },
    1,
  );
  await mockApiResponse(
    'address_tokens',
    { ...tokensMock.erc404List, next_page_params: null },
    { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-404' } },
    1,
  );
  await injectMetaMaskProvider();

  const component = await mount(
    <TestApp>
      <MockAddressPage>
        <AddressDetails addressQuery={{ data: addressMock.token } as AddressQuery}/>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('validator', async({ mount, page, mockApiResponse }) => {
  await mockApiResponse('address', addressMock.validator, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

  const component = await mount(
    <TestApp>
      <AddressDetails addressQuery={{ data: addressMock.validator } as AddressQuery}/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
