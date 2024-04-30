import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { AddressesResponse } from 'types/api/addresses';

import * as addressMocks from 'mocks/address/address';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import Accounts from './Accounts';

const ADDRESSES_API_URL = buildApiUrl('addresses');

const addresses: AddressesResponse = {
  items: [
    {
      ...addressMocks.withName,
      tx_count: '1',
      coin_balance: '12345678901234567890000',
    }, {
      ...addressMocks.token,
      tx_count: '109123890123',
      coin_balance: '22222345678901234567890000',
      ens_domain_name: null,
    }, {
      ...addressMocks.withoutName,
      tx_count: '11',
      coin_balance: '1000000000000000000',
    },
  ],
  total_supply: '25222000',
  next_page_params: null,
};

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(ADDRESSES_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addresses),
  }));
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  const component = await mount(
    <TestApp>
      <Accounts/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
