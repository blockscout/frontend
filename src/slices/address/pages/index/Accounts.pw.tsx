import React from 'react';

import type { paths } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { test, expect } from 'playwright/lib';

import Accounts from './Accounts';

const addresses: paths['/api/v2/addresses']['get'] = {
  items: [
    {
      ...addressParamMock.withName,
      transactions_count: '1',
      coin_balance: '12345678901234567890000',
    },
    {
      ...addressParamMock.contract,
      transactions_count: '109123890123',
      coin_balance: '22222345678901234567890000',
      ens_domain_name: null,
    },
    {
      ...addressParamMock.withPublicTag,
      transactions_count: '11',
      coin_balance: '1000000000000000000',
    },
    {
      ...addressParamMock.withNameTag,
      transactions_count: '420',
      coin_balance: '123456',
    },
  ],
  total_supply: '25222000',
  exchange_rate: '1',
  next_page_params: null,
};

test('base view +@mobile +@dark-mode', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('core:addresses', addresses);
  const component = await render(<Accounts/>);
  await expect(component).toHaveScreenshot();
});
