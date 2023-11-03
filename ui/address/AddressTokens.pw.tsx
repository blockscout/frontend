import { Box } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as tokensMock from 'mocks/address/tokens';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressTokens from './AddressTokens';

const ADDRESS_HASH = addressMock.withName.hash;
const API_URL_ADDRESS = buildApiUrl('address', { hash: ADDRESS_HASH });
const API_URL_TOKENS = buildApiUrl('address_tokens', { hash: ADDRESS_HASH });
const API_URL_NFT = buildApiUrl('address_nfts', { hash: ADDRESS_HASH }) + '?type=';
const API_URL_COLLECTIONS = buildApiUrl('address_collections', { hash: ADDRESS_HASH }) + '?type=';

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
      body: JSON.stringify(addressMock.withName),
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
    await page.route(API_URL_NFT, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokensMock.nfts),
    }));
    await page.route(API_URL_COLLECTIONS, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokensMock.collections),
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

test('collections +@dark-mode', async({ mount }) => {
  const hooksConfig = {
    router: {
      query: { hash: ADDRESS_HASH, tab: 'tokens_nfts' },
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

test('nfts +@dark-mode', async({ mount }) => {
  const hooksConfig = {
    router: {
      query: { hash: ADDRESS_HASH, tab: 'tokens_nfts' },
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

  await component.getByText('List').click();

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

  test('nfts', async({ mount }) => {
    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_nfts' },
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

    await component.getByLabel('list').click();

    await expect(component).toHaveScreenshot();
  });

  test('collections', async({ mount }) => {
    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_nfts' },
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

base.describe('update balances via socket', () => {
  const test = base.extend<socketServer.SocketServerFixture>({
    createSocket: socketServer.createSocket,
  });
  test.describe.configure({ mode: 'serial' });

  test('', async({ mount, page, createSocket }) => {
    test.slow();

    const hooksConfig = {
      router: {
        query: { hash: ADDRESS_HASH, tab: 'tokens_erc20' },
        isReady: true,
      },
    };

    const response20 = {
      items: [ tokensMock.erc20a, tokensMock.erc20b ],
      next_page_params: null,
    };
    const response721 = {
      items: [ tokensMock.erc721a, tokensMock.erc721b ],
      next_page_params: null,
    };
    const response1155 = {
      items: [ tokensMock.erc1155a ],
      next_page_params: null,
    };

    await page.route(API_URL_ADDRESS, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(addressMock.validator),
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

    const component = await mount(
      <TestApp withSocket>
        <Box>
          <Box h={{ base: '134px', lg: 6 }}/>
          <AddressTokens/>
        </Box>
      </TestApp>,
      { hooksConfig },
    );

    await page.waitForResponse(API_URL_TOKENS + '?type=ERC-20');
    await page.waitForResponse(API_URL_TOKENS + '?type=ERC-721');
    await page.waitForResponse(API_URL_TOKENS + '?type=ERC-1155');

    await expect(component).toHaveScreenshot();

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ ADDRESS_HASH.toLowerCase() }`);
    socketServer.sendMessage(socket, channel, 'updated_token_balances_erc_20', {
      overflow: false,
      token_balances: [
        {
          ...tokensMock.erc20a,
          token: {
            ...tokensMock.erc20a.token,
            exchange_rate: '0.01',
          },
        },
        {
          ...tokensMock.erc20c,
          value: '9852000000000000',
          token: {
            ...tokensMock.erc20c.token,
            address: '0xE2cf36D00C57e01371b94B4206ae2CF841931Adc',
            name: 'Tether USD',
            symbol: 'USDT',
          },
        },
      ],
    });
    socketServer.sendMessage(socket, channel, 'updated_token_balances_erc_721', {
      overflow: false,
      token_balances: [
        {
          ...tokensMock.erc721c,
          token: {
            ...tokensMock.erc721c.token,
            exchange_rate: '20',
          },
        },
      ],
    });

    await expect(component).toHaveScreenshot();
  });
});
