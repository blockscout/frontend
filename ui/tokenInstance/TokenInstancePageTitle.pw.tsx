import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import type { WindowProvider } from 'wagmi';

import type { TokenInstance } from 'types/api/token';

import * as textAdMock from 'mocks/ad/textAd';
import * as addressMock from 'mocks/address/address';
import * as tokenInstanceMock from 'mocks/tokens/tokenInstance';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TokenInstancePageTitle from './TokenInstancePageTitle';

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

  await page.evaluate(() => {
    window.ethereum = {
      providers: [ { isMetaMask: true } ],
    } as WindowProvider;
  });
});

test('default view +@mobile', async({ mount, page }) => {
  const tokenInstanceQuery = {
    data: tokenInstanceMock.fullData,
  } as UseQueryResult<TokenInstance>;

  const component = await mount(
    <TestApp>
      <TokenInstancePageTitle tokenInstanceQuery={ tokenInstanceQuery } hash={ addressMock.hash }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});

test('loading state +@mobile', async({ mount, page }) => {
  const tokenInstanceQuery = {
    data: tokenInstanceMock.fullData,
    isPlaceholderData: true,
  } as UseQueryResult<TokenInstance>;

  const component = await mount(
    <TestApp>
      <TokenInstancePageTitle tokenInstanceQuery={ tokenInstanceQuery } hash={ addressMock.hash }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsTextSelector) ],
    maskColor: configs.maskColor,
  });
});
