import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import TestApp from 'playwright/TestApp';

import TokenSnippet from './TokenSnippet';

test.use(devices['iPhone 13 Pro']);

test('unnamed', async({ mount }) => {
  const data: TokenInfo = {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    circulating_market_cap: '117629601.61913824',
    type: 'ERC-20',
    symbol: 'xDAI',
    name: null,
    decimals: '18',
    holders: '1',
    exchange_rate: null,
    total_supply: null,
    icon_url: null,
  };
  const component = await mount(
    <TestApp>
      <TokenSnippet data={ data }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('named', async({ mount }) => {
  const data: TokenInfo = {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    circulating_market_cap: '117629601.61913824',
    type: 'ERC-20',
    symbol: 'SHA',
    name: 'Shavuha token',
    decimals: '18',
    holders: '1',
    exchange_rate: null,
    total_supply: null,
    icon_url: null,
  };
  const component = await mount(
    <TestApp>
      <TokenSnippet data={ data }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with logo and long symbol', async({ mount, page }) => {
  const API_URL = 'https://example.com/logo.png';
  const data: TokenInfo = {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    circulating_market_cap: '117629601.61913824',
    type: 'ERC-20',
    symbol: 'SHAAAAAAAAAAAAA',
    name: null,
    decimals: '18',
    holders: '1',
    exchange_rate: null,
    total_supply: null,
    icon_url: API_URL,
  };

  await page.route(API_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <TokenSnippet data={ data }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
