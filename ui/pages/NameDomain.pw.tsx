import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import config from 'configs/app';
import * as textAdMock from 'mocks/ad/textAd';
import * as ensDomainMock from 'mocks/ens/domain';
import * as ensDomainEventsMock from 'mocks/ens/events';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import NameDomain from './NameDomain';

const DOMAIN_API_URL = buildApiUrl('domain_info', { chainId: config.chain.id, name: ensDomainMock.ensDomainA.name });
const DOMAIN_EVENTS_API_URL = buildApiUrl('domain_events', { chainId: config.chain.id, name: ensDomainMock.ensDomainA.name });

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('details tab', async({ mount, page }) => {
  await page.route(DOMAIN_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(ensDomainMock.ensDomainA),
  }));

  const component = await mount(
    <TestApp>
      <NameDomain/>
    </TestApp>,
    { hooksConfig: {
      router: {
        query: { name: ensDomainMock.ensDomainA.name },
        isReady: true,
      },
    } },
  );

  await expect(component).toHaveScreenshot();
});

test('history tab +@mobile', async({ mount, page }) => {
  await page.route(DOMAIN_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(ensDomainMock.ensDomainA),
  }));
  await page.route(DOMAIN_EVENTS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        ensDomainEventsMock.ensDomainEventA,
        ensDomainEventsMock.ensDomainEventB,
      ],
      totalRecords: 2,
    }),
  }));

  const component = await mount(
    <TestApp>
      <NameDomain/>
    </TestApp>,
    { hooksConfig: {
      router: {
        query: { name: ensDomainMock.ensDomainA.name, tab: 'history' },
        isReady: true,
      },
    } },
  );

  await expect(component).toHaveScreenshot();
});
