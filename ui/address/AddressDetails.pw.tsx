import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as countersMock from 'mocks/address/counters';
import * as tokensMock from 'mocks/address/tokens';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

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

  test('contract', async({ render, mockApiResponse, page }) => {
    await mockApiResponse('general:address', addressMock.contract, { pathParams: { hash: ADDRESS_HASH } });
    await mockApiResponse('general:address_counters', countersMock.forContract, { pathParams: { hash: ADDRESS_HASH } });

    const component = await render(<AddressDetails addressQuery={{ data: addressMock.contract } as AddressQuery}/>, { hooksConfig });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });

  test('validator', async({ render, page, mockApiResponse }) => {
    await mockApiResponse('general:address', addressMock.validator, { pathParams: { hash: ADDRESS_HASH } });
    await mockApiResponse('general:address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

    const component = await render(<AddressDetails addressQuery={{ data: addressMock.validator } as AddressQuery}/>, { hooksConfig });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });

  test('filecoin', async({ render, mockApiResponse, page }) => {
    await mockApiResponse('general:address', addressMock.filecoin, { pathParams: { hash: ADDRESS_HASH } });
    await mockApiResponse('general:address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

    const component = await render(<AddressDetails addressQuery={{ data: addressMock.filecoin } as AddressQuery}/>, { hooksConfig });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});

test('contract', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('general:address', addressMock.contract, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('general:address_counters', countersMock.forContract, { pathParams: { hash: ADDRESS_HASH } });

  const component = await render(<AddressDetails addressQuery={{ data: addressMock.contract } as AddressQuery}/>, { hooksConfig });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

// there's an unexpected timeout occurred in this test
test.fixme('token', async({ render, mockApiResponse, injectMetaMaskProvider, page }) => {
  await mockApiResponse('general:address', addressMock.token, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('general:address_counters', countersMock.forToken, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('general:address_tokens', tokensMock.erc20List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-20' }, times: 1 });
  await mockApiResponse('general:address_tokens', tokensMock.erc721List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-721' }, times: 1 });
  await mockApiResponse('general:address_tokens', tokensMock.erc1155List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-1155' }, times: 1 });
  await mockApiResponse('general:address_tokens', tokensMock.erc404List, { pathParams: { hash: ADDRESS_HASH }, queryParams: { type: 'ERC-404' }, times: 1 });
  await injectMetaMaskProvider();

  const component = await render(
    <MockAddressPage>
      <AddressDetails addressQuery={{ data: addressMock.token } as AddressQuery}/>
    </MockAddressPage>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('validator', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('general:address', addressMock.validator, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('general:address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

  const component = await render(<AddressDetails addressQuery={{ data: addressMock.validator } as AddressQuery}/>, { hooksConfig });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('filecoin', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('general:address', addressMock.filecoin, { pathParams: { hash: ADDRESS_HASH } });
  await mockApiResponse('general:address_counters', countersMock.forValidator, { pathParams: { hash: ADDRESS_HASH } });

  const component = await render(<AddressDetails addressQuery={{ data: addressMock.filecoin } as AddressQuery}/>, { hooksConfig });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
