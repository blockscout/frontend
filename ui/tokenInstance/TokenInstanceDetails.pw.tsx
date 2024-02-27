import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import { tokenInfoERC721a } from 'mocks/tokens/tokenInfo';
import * as tokenInstanceMock from 'mocks/tokens/tokenInstance';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import TokenInstanceDetails from './TokenInstanceDetails';

const hash = tokenInfoERC721a.address;

const API_URL_ADDRESS = buildApiUrl('address', { hash });
const API_URL_TOKEN_TRANSFERS_COUNT = buildApiUrl('token_instance_transfers_count', {
  id: tokenInstanceMock.unique.id,
  hash,
});

test('base view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route('http://localhost:3000/nft-marketplace-logo.png', (route) => route.fulfill({
    status: 200,
    path: './playwright/mocks/image_s.jpg',
  }));
  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.contract),
  }));
  await page.route(API_URL_TOKEN_TRANSFERS_COUNT, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ transfers_count: 42 }),
  }));

  const component = await mount(
    <TestApp>
      <TokenInstanceDetails data={ tokenInstanceMock.unique } token={ tokenInfoERC721a }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});
