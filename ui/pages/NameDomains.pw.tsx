import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import { test, expect } from 'playwright/lib';

import NameDomains from './NameDomains';

test.beforeEach(async({ mockApiResponse, mockAssetResponse, mockTextAd }) => {
  await mockTextAd();
  await mockAssetResponse(ensDomainMock.protocolA.icon_url as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(ensDomainMock.protocolB.icon_url as string, './playwright/mocks/image_md.jpg');
  await mockApiResponse('bens:domains_lookup', {
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
  await mockApiResponse('bens:domain_protocols', {
    items: [ ensDomainMock.protocolA, ensDomainMock.protocolB ],
  }, {
    pathParams: { chainId: config.chain.id },
  });
});

test('default view +@mobile', async({ render }) => {
  test.slow();
  const component = await render(<NameDomains/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});

test('filters', async({ render, page }) => {
  const component = await render(<NameDomains/>);

  await component.getByRole('button', { name: 'Filter' }).click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 500 } });
});
