import { Box } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { withName } from 'mocks/address/address';
import * as tokensMock from 'mocks/address/tokens';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressTokens from './AddressTokens';

const ADDRESS_HASH = withName.hash;
const API_URL_ADDRESS = buildApiUrl('address', { hash: ADDRESS_HASH });
const API_URL_TOKENS = buildApiUrl('address_tokens', { hash: ADDRESS_HASH });

const nextPageParams = {
  items_count: 50,
  token_name: 'aaa',
  token_type: '123',
  value: 1,
};

const test = base.extend({
  page: async({ page }, use) => {
    const response20 = {
      items: [ tokensMock.erc20a, tokensMock.erc20b, tokensMock.erc20c, tokensMock.erc20d ],
      next_page_params: nextPageParams,
    };
    const response721 = {
      items: [ tokensMock.erc721a, tokensMock.erc721b, tokensMock.erc721c ],
      next_page_params: nextPageParams,
    };
    const response1155 = {
      items: [ tokensMock.erc1155a, tokensMock.erc1155b ],
      next_page_params: nextPageParams,
    };

    await page.route(API_URL_ADDRESS, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(withName),
    }));
    await page.route(API_URL_TOKENS + '?type=ERC-20', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(response20),
    }));
    await page.route(API_URL_TOKENS + '?type=ERC-721', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(response721),
    }));
    await page.route(API_URL_TOKENS + '?type=ERC-1155', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(response1155),
    }));

    use(page);
  },
});

test('erc20 +@dark-mode', async({ mount }) => {
  const hooksConfig = {
    router: {
      query: { hash: ADDRESS_HASH, tab: 'tokens_erc20' },
      isReady: true,
    },
  };

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('erc721 +@dark-mode', async({ mount }) => {
  const hooksConfig = {
    router: {
      query: { hash: ADDRESS_HASH, tab: 'tokens_erc721' },
      isReady: true,
    },
  };

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('erc1155 +@dark-mode', async({ mount }) => {
  const hooksConfig = {
    router: {
      query: { hash: ADDRESS_HASH, tab: 'tokens_erc1155' },
      isReady: true,
    },
  };

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokens/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('erc20', async({ mount }) => {
    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_erc20' },
        isReady: true,
      },
    };

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokens/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });

  test('erc721', async({ mount }) => {
    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_erc721' },
        isReady: true,
      },
    };

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokens/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });

  test('erc1155', async({ mount }) => {
    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_erc1155' },
        isReady: true,
      },
    };

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokens/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
