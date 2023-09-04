import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import type { WindowProvider } from 'wagmi';

import type { Address } from 'types/api/address';
import type { TokenInfo, TokenVerifiedInfo } from 'types/api/token';

import * as verifiedAddressesMock from 'mocks/account/verifiedAddresses';
import * as textAdMock from 'mocks/ad/textAd';
import * as addressMock from 'mocks/address/address';
import * as tokenMock from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TokenPageTitle from './TokenPageTitle';

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

test.describe('without project info', () => {
  test('loaded +@mobile', async({ mount, page }) => {
    const tokenQuery = {
      data: tokenMock.tokenWithLongNameAndSymbol,
    } as UseQueryResult<TokenInfo>;

    const contractQuery = {
      data: {
        ...addressMock.contract,
        token: addressMock.token.token,
      },
    } as UseQueryResult<Address>;

    const verifiedInfoQuery = {
      data: {},
    } as UseQueryResult<TokenVerifiedInfo>;

    const component = await mount(
      <TestApp>
        <TokenPageTitle
          tokenQuery={ tokenQuery }
          contractQuery={ contractQuery }
          verifiedInfoQuery={ verifiedInfoQuery }
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsTextSelector) ],
      maskColor: configs.maskColor,
    });
  });

  test('loading +@mobile', async({ mount, page }) => {
    const tokenQuery = {
      data: tokenMock.tokenWithLongNameAndSymbol,
      isPlaceholderData: true,
    } as UseQueryResult<TokenInfo>;

    const contractQuery = {
      data: {
        ...addressMock.contract,
        token: addressMock.token.token,
      },
      isPlaceholderData: true,
    } as UseQueryResult<Address>;

    const verifiedInfoQuery = {
      data: {},
      isLoading: true,
    } as unknown as UseQueryResult<TokenVerifiedInfo>;

    const component = await mount(
      <TestApp>
        <TokenPageTitle
          tokenQuery={ tokenQuery }
          contractQuery={ contractQuery }
          verifiedInfoQuery={ verifiedInfoQuery }
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsTextSelector) ],
      maskColor: configs.maskColor,
    });
  });
});

test.describe('with project info', () => {
  test('loaded +@mobile', async({ mount, page }) => {
    const tokenQuery = {
      data: tokenMock.tokenWithLongNameAndSymbol,
    } as UseQueryResult<TokenInfo>;

    const contractQuery = {
      data: {
        ...addressMock.contract,
        token: addressMock.token.token,
      },
    } as UseQueryResult<Address>;

    const verifiedInfoQuery = {
      data: verifiedAddressesMock.TOKEN_INFO_APPLICATION.APPROVED,
    } as unknown as UseQueryResult<TokenVerifiedInfo>;

    const component = await mount(
      <TestApp>
        <TokenPageTitle
          tokenQuery={ tokenQuery }
          contractQuery={ contractQuery }
          verifiedInfoQuery={ verifiedInfoQuery }
        />
      </TestApp>,
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsTextSelector) ],
      maskColor: configs.maskColor,
    });
  });
});
