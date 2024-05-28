import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import { test, expect } from 'playwright/lib';

import AddressEnsDomains from './AddressEnsDomains';

const ADDRESS_HASH = ensDomainMock.ensDomainA.owner?.hash as string;

test('base view', async({ render, mockApiResponse, page }) => {
  await mockApiResponse(
    'addresses_lookup',
    {
      items: [
        ensDomainMock.ensDomainA,
        ensDomainMock.ensDomainB,
        ensDomainMock.ensDomainC,
        ensDomainMock.ensDomainD,
      ],
      next_page_params: null,
    },
    {
      pathParams: { chainId: config.chain.id },
      queryParams: {
        address: ADDRESS_HASH,
        resolved_to: true,
        owned_by: true,
        only_active: true,
        order: 'ASC',
      },
    },
  );
  const component = await render(<AddressEnsDomains addressHash={ ADDRESS_HASH } mainDomainName={ ensDomainMock.ensDomainA.name }/>);
  await component.getByText('4').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 550, height: 350 } });
});
