import type { MetaMaskInpageProvider } from '@metamask/providers';
import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import * as addressMock from 'mocks/address/address';
import * as countersMock from 'mocks/address/counters';
import * as tokenBalanceMock from 'mocks/address/tokenBalance';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressDetails from './AddressDetails';
import MockAddressPage from './testUtils/MockAddressPage';

const ADDRESS_HASH = addressMock.hash;
const API_URL_ADDRESS = buildApiUrl('address', { id: ADDRESS_HASH });
const API_URL_COUNTERS = buildApiUrl('address_counters', { id: ADDRESS_HASH });
const API_URL_TOKEN_BALANCES = buildApiUrl('address_token_balances', { id: ADDRESS_HASH });
const hooksConfig = {
  router: {
    query: { id: ADDRESS_HASH },
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
      <AddressDetails addressQuery={{ data: addressMock.contract } as UseQueryResult<Address, unknown>}/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('token +@mobile', async({ mount, page }) => {
  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.token),
  }));
  await page.route(API_URL_COUNTERS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(countersMock.forToken),
  }));
  await page.route(API_URL_TOKEN_BALANCES, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenBalanceMock.baseList),
  }));

  await page.evaluate(() => {
    window.ethereum = { } as MetaMaskInpageProvider;
  });

  const component = await mount(
    <TestApp>
      <MockAddressPage>
        <AddressDetails addressQuery={{ data: addressMock.token } as UseQueryResult<Address, unknown>}/>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
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
      <AddressDetails addressQuery={{ data: addressMock.validator } as UseQueryResult<Address, unknown>}/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
