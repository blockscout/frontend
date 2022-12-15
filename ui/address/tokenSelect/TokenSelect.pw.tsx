import { Flex } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as coinBalanceMock from 'mocks/address/coinBalanceHistory';
import * as tokenBalanceMock from 'mocks/address/tokenBalance';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import MockAddressPage from 'ui/address/testUtils/MockAddressPage';

import TokenSelect from './TokenSelect';

const ASSET_URL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/assets/0xb2a90505dc6680a7a695f7975d0d32EeF610f456/logo.png';
const TOKENS_API_URL = '/node-api/addresses/1/token-balances';
const ADDRESS_API_URL = '/node-api/addresses/1';
const hooksConfig = {
  router: {
    query: { id: '1' },
  },
};
const CLIPPING_AREA = { x: 0, y: 0, width: 360, height: 500 };

const test = base.extend({
  page: async({ page }, use) => {
    await page.route(ASSET_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });
    await page.route(ADDRESS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ hash: '1' }),
    }), { times: 1 });
    await page.route(TOKENS_API_URL, async(route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokenBalanceMock.baseList),
    }), { times: 1 });

    use(page);
  },
});

test('base view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByRole('button', { name: /select/i }).click();
  await page.getByText('USD Coin').hover();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page }) => {
    await mount(
      <TestApp>
        <MockAddressPage>
          <Flex>
            <TokenSelect/>
          </Flex>
        </MockAddressPage>
      </TestApp>,
      { hooksConfig },
    );

    await page.getByRole('button', { name: /select/i }).click();
    await page.getByText('USD Coin').hover();

    await expect(page).toHaveScreenshot();
  });
});

test('sort', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );
  await page.getByRole('button', { name: /select/i }).click();
  await page.locator('a[aria-label="Sort ERC-20 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await page.locator('a[aria-label="Sort ERC-1155 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test('filter', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );
  await page.getByRole('button', { name: /select/i }).click();
  await page.getByPlaceholder('Search by token name').type('c');

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test.describe('socket', () => {
  const testWithSocket = test.extend<socketServer.SocketServerFixture>({
    createSocket: socketServer.createSocket,
  });
  testWithSocket.describe.configure({ mode: 'serial' });

  testWithSocket('new item after token balance update', async({ page, mount, createSocket }) => {
    await mount(
      <TestApp withSocket>
        <MockAddressPage>
          <Flex>
            <TokenSelect/>
          </Flex>
        </MockAddressPage>
      </TestApp>,
      { hooksConfig },
    );

    await page.route(TOKENS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        ...tokenBalanceMock.baseList,
        tokenBalanceMock.erc20d,
      ]),
    }));

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'addresses:1');
    socketServer.sendMessage(socket, channel, 'token_balance', {
      block_number: 1,
    });

    const button = page.getByRole('button', { name: /select/i });
    const text = await button.innerText();
    expect(text).toContain('10');
  });

  testWithSocket('new item after coin balance update', async({ page, mount, createSocket }) => {
    await mount(
      <TestApp withSocket>
        <MockAddressPage>
          <Flex>
            <TokenSelect/>
          </Flex>
        </MockAddressPage>
      </TestApp>,
      { hooksConfig },
    );

    await page.route(TOKENS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        ...tokenBalanceMock.baseList,
        tokenBalanceMock.erc20d,
      ]),
    }));

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'addresses:1');
    socketServer.sendMessage(socket, channel, 'coin_balance', {
      coin_balance: coinBalanceMock.base,
    });

    const button = page.getByRole('button', { name: /select/i });
    const text = await button.innerText();
    expect(text).toContain('10');
  });
});
