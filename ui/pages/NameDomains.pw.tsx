import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import { test, expect } from 'playwright/lib';

import NameDomains from './NameDomains';

test('default view +@mobile', async({ render, mockApiResponse, mockTextAd }) => {
  await mockTextAd();
  await mockApiResponse('domains_lookup', {
    items: [
      ensDomainMock.ensDomainA,
      ensDomainMock.ensDomainB,
      ensDomainMock.ensDomainC,
      ensDomainMock.ensDomainD,
    ],
    next_page_params: {
      page_token: '<token>',
      page_size: 50,
    },
  }, {
    pathParams: { chainId: config.chain.id },
    queryParams: { only_active: true },
  });

  const component = await render(<NameDomains/>);
  await expect(component).toHaveScreenshot();
});
