import React from 'react';

import type { AddressesResponse } from 'types/api/addresses';

import * as addressMocks from 'mocks/address/address';
import { test, expect } from 'playwright/lib';

import Accounts from './Accounts';

const addresses: AddressesResponse = {
  items: [
    {
      ...addressMocks.withName,
      transaction_count: '1',
      coin_balance: '12345678901234567890000',
    },
    {
      ...addressMocks.token,
      transaction_count: '109123890123',
      coin_balance: '22222345678901234567890000',
      ens_domain_name: null,
    },
    {
      ...addressMocks.withoutName,
      transaction_count: '11',
      coin_balance: '1000000000000000000',
    },
    {
      ...addressMocks.eoa,
      transaction_count: '420',
      coin_balance: '123456',
    },
  ],
  total_supply: '25222000',
  next_page_params: null,
};

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('addresses', addresses);
  const component = await render(<Accounts/>);
  await expect(component).toHaveScreenshot();
});
