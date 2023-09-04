import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import type { WindowProvider } from 'wagmi';

import type { Address } from 'types/api/address';

import * as textAdMock from 'mocks/ad/textAd';
import * as addressMock from 'mocks/address/address';
import * as tokenMock from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import AddressPageTitle from './AddressPageTitle';

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
  await page.route(tokenMock.tokenWithLongNameAndSymbol.icon_url || 'https://example.com/logo.png', (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  await page.evaluate(() => {
    window.ethereum = {
      providers: [ { isMetaMask: true } ],
    } as WindowProvider;
  });
});

test('EOA +@mobile', async({ mount, page }) => {
  const addressQuery = {
    data: addressMock.withName,
  } as UseQueryResult<Address>;

  const component = await mount(
    <TestApp>
      <AddressPageTitle addressQuery={ addressQuery }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});

test('contract +@mobile', async({ mount, page }) => {
  const addressQuery = {
    data: addressMock.contract,
  } as UseQueryResult<Address>;

  const component = await mount(
    <TestApp>
      <AddressPageTitle addressQuery={ addressQuery }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});

test('token contract +@mobile', async({ mount, page }) => {
  const addressQuery = {
    data: {
      ...addressMock.contract,
      token: tokenMock.tokenWithLongNameAndSymbol,
    },
  } as UseQueryResult<Address>;

  const component = await mount(
    <TestApp>
      <AddressPageTitle addressQuery={ addressQuery }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});

test('loading state +@mobile', async({ mount, page }) => {
  const addressQuery = {
    data: {
      ...addressMock.contract,
      token: tokenMock.tokenWithLongNameAndSymbol,
    },
    isPlaceholderData: true,
  } as UseQueryResult<Address>;

  const component = await mount(
    <TestApp>
      <AddressPageTitle addressQuery={ addressQuery }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});
