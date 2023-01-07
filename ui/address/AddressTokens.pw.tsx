import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { withName } from 'mocks/address/address';
import * as tokenBalanceMock from 'mocks/address/tokenBalance';
import { baseList } from 'mocks/address/tokenBalance';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressTokens from './AddressTokens';

const ADDRESS_HASH = withName.hash;
const API_URL_ADDRESS = buildApiUrl('address', { id: ADDRESS_HASH });
const API_URL_ADDRESS_TOKEN_BALANCES = buildApiUrl('address_token_balances', { id: ADDRESS_HASH });
const API_URL_TOKENS = buildApiUrl('address_tokens', { id: ADDRESS_HASH });

const nextPageParams = {
  items_count: 50,
  token_name: 'aaa',
  token_type: '123',
  value: 1,
};

test('erc20 +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { id: ADDRESS_HASH, tab: 'tokens_erc20' },
      isReady: true,
    },
  };

  const response20 = {
    items: [ tokenBalanceMock.erc20a, tokenBalanceMock.erc20b, tokenBalanceMock.erc20c, tokenBalanceMock.erc20d ],
    next_page_params: nextPageParams,
  };

  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withName),
  }));
  await page.route(API_URL_ADDRESS_TOKEN_BALANCES, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(baseList),
  }));
  await page.route(API_URL_TOKENS + '?type=ERC-20', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(response20),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('erc721 +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { id: ADDRESS_HASH, tab: 'tokens_erc721' },
      isReady: true,
    },
  };

  const response20 = {
    items: [ tokenBalanceMock.erc721a, tokenBalanceMock.erc721b, tokenBalanceMock.erc721c ],
    next_page_params: nextPageParams,
  };

  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withName),
  }));
  await page.route(API_URL_ADDRESS_TOKEN_BALANCES, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(baseList),
  }));
  await page.route(API_URL_TOKENS + '?type=ERC-721', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(response20),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('erc1155 +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { id: ADDRESS_HASH, tab: 'tokens_erc1155' },
      isReady: true,
    },
  };

  const response20 = {
    items: [ tokenBalanceMock.erc1155a, tokenBalanceMock.erc1155b ],
    next_page_params: nextPageParams,
  };

  await page.route(API_URL_ADDRESS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withName),
  }));
  await page.route(API_URL_ADDRESS_TOKEN_BALANCES, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(baseList),
  }));
  await page.route(API_URL_TOKENS + '?type=ERC-1155', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(response20),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
