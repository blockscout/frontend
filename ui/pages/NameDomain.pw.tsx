import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import * as ensDomainEventsMock from 'mocks/ens/events';
import { test, expect } from 'playwright/lib';

import NameDomain from './NameDomain';

test('details tab', async({ render, mockTextAd, mockApiResponse, mockAssetResponse }) => {
  await mockTextAd();
  await mockApiResponse('bens:domain_info', ensDomainMock.ensDomainA, {
    pathParams: { chainId: config.chain.id, name: ensDomainMock.ensDomainA.name },
  });
  await mockAssetResponse(ensDomainMock.ensDomainA.protocol?.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <NameDomain/>,
    { hooksConfig: {
      router: {
        query: { name: ensDomainMock.ensDomainA.name },
        isReady: true,
      },
    } },
  );
  await expect(component).toHaveScreenshot();
});

test('history tab +@mobile', async({ render, mockTextAd, mockApiResponse, mockAssetResponse }) => {
  await mockTextAd();
  await mockApiResponse('bens:domain_info', ensDomainMock.ensDomainA, {
    pathParams: { chainId: config.chain.id, name: ensDomainMock.ensDomainA.name },
  });
  await mockApiResponse('bens:domain_events', {
    items: [
      ensDomainEventsMock.ensDomainEventA,
      ensDomainEventsMock.ensDomainEventB,
    ],
  }, {
    pathParams: { chainId: config.chain.id, name: ensDomainMock.ensDomainA.name },
  });
  await mockAssetResponse(ensDomainMock.ensDomainA.protocol?.icon_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(
    <NameDomain/>,
    { hooksConfig: {
      router: {
        query: { name: ensDomainMock.ensDomainA.name, tab: 'history' },
        isReady: true,
      },
    } },
  );
  await expect(component).toHaveScreenshot();
});
