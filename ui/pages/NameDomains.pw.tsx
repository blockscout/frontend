import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import config from 'configs/app';
import * as textAdMock from 'mocks/ad/textAd';
import * as ensDomainMock from 'mocks/ens/domain';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import NameDomains from './NameDomains';

const DOMAINS_LOOKUP_API_URL = buildApiUrl('domains_lookup', { chainId: config.chain.id }) + '?only_active=true';

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

test('default view +@mobile', async({ mount, page }) => {
  await page.route(DOMAINS_LOOKUP_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        ensDomainMock.ensDomainA,
        ensDomainMock.ensDomainB,
        ensDomainMock.ensDomainC,
        ensDomainMock.ensDomainD,
      ],
      next_page_params: {
        token_id: '<token-id>',
      },
    }),
  }));

  const component = await mount(
    <TestApp>
      <NameDomains/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
