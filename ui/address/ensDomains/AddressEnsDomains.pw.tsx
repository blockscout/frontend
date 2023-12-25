import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressEnsDomains from './AddressEnsDomains';

const ADDRESSES_LOOKUP_API_URL = buildApiUrl('addresses_lookup', { chainId: config.chain.id });
const ADDRESS_HASH = ensDomainMock.ensDomainA.owner?.hash ?? '';

test('base view', async({ mount, page }) => {
  await page.route(ADDRESSES_LOOKUP_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        ensDomainMock.ensDomainA,
        ensDomainMock.ensDomainB,
        ensDomainMock.ensDomainC,
        ensDomainMock.ensDomainD,
      ],
      totalRecords: 4,
    }),
  }));

  const component = await mount(
    <TestApp>
      <AddressEnsDomains addressHash={ ADDRESS_HASH } mainDomainName={ ensDomainMock.ensDomainA.name }/>
    </TestApp>,
  );

  await component.getByText('4 domains').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 550, height: 350 } });
});
