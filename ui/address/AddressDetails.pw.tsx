import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';
import type { WindowProvider } from 'wagmi';

import * as addressMock from 'mocks/address/address';
import * as countersMock from 'mocks/address/counters';
import * as tokensMock from 'mocks/address/tokens';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import AddressDetails from './AddressDetails';
import MockAddressPage from './testUtils/MockAddressPage';
import type { AddressQuery } from './utils/useAddressQuery';

const ADDRESS_HASH = addressMock.hash;
const API_URL_ADDRESS = buildApiUrl('address', { hash: ADDRESS_HASH });
const API_URL_COUNTERS = buildApiUrl('address_counters', { hash: ADDRESS_HASH });
const API_URL_TOKENS_ERC20 = buildApiUrl('address_tokens', { hash: ADDRESS_HASH }) + '?type=ERC-20';
const API_URL_TOKENS_ERC721 = buildApiUrl('address_tokens', { hash: ADDRESS_HASH }) + '?type=ERC-721';
const API_URL_TOKENS_ER1155 = buildApiUrl('address_tokens', { hash: ADDRESS_HASH }) + '?type=ERC-1155';
const hooksConfig = {
  router: {
    query: { hash: ADDRESS_HASH },
  },
};

test('contract +@mobile', async({ mount, page }) => {
  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.contract),
  }));
  await page.route(API_URL_COUNTERS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(countersMock.forContract),
  }));

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

test('token', async({ mount, page }) => {
  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.token),
  }));
  await page.route(API_URL_COUNTERS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(countersMock.forToken),
  }));
  await page.route(API_URL_TOKENS_ERC20, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokensMock.erc20List),
  }), { times: 1 });
  await page.route(API_URL_TOKENS_ERC721, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokensMock.erc721List),
  }), { times: 1 });
  await page.route(API_URL_TOKENS_ER1155, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokensMock.erc1155List),
  }), { times: 1 });

  await page.evaluate(() => {
    window.ethereum = {
      providers: [ { isMetaMask: true, _events: {} } ],
    }as WindowProvider;
  });

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

test('validator +@mobile', async({ mount, page }) => {
  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.validator),
  }));
  await page.route(API_URL_COUNTERS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(countersMock.forValidator),
  }));

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
