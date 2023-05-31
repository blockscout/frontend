import { Box } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressTokenTransfers from './AddressTokenTransfers';

const CURRENT_ADDRESS = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

const API_URL = buildApiUrl('address_token_transfers', { hash: CURRENT_ADDRESS }) +
 '?token=0x1189a607CEac2f0E14867de4EB15b15C9FFB5859';

const hooksConfig = {
  router: {
    query: { hash: CURRENT_ADDRESS, token: '0x1189a607CEac2f0E14867de4EB15b15C9FFB5859' },
  },
};

const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test('with token filter and pagination', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokenTransfers/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('with token filter and no pagination', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ] }),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokenTransfers/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('with token filter and pagination', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });

  test('with token filter and no pagination', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ] }),
    }));

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('socket', () => {
  test('without overload', async({ mount, page, createSocket }) => {
    const hooksConfigNoToken = {
      router: {
        query: { hash: CURRENT_ADDRESS },
      },
    };

    const API_URL_NO_TOKEN = buildApiUrl('address_token_transfers', { hash: CURRENT_ADDRESS }) + '?type=';

    await page.route(API_URL_NO_TOKEN, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig: hooksConfigNoToken },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'token_transfer', { token_transfers: [ tokenTransferMock.erc1155B, tokenTransferMock.erc1155C ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(4);
  });

  test('with overload', async({ mount, page, createSocket }) => {
    const hooksConfigNoToken = {
      router: {
        query: { hash: CURRENT_ADDRESS },
      },
    };

    const API_URL_NO_TOKEN = buildApiUrl('address_token_transfers', { hash: CURRENT_ADDRESS }) + '?type=';

    await page.route(API_URL_NO_TOKEN, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers overloadCount={ 2 }/>
      </TestApp>,
      { hooksConfig: hooksConfigNoToken },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'token_transfer', { token_transfers: [ tokenTransferMock.erc1155B, tokenTransferMock.erc1155C ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);

    const counter = await page.locator('tbody tr:nth-child(1)').textContent();
    expect(counter?.startsWith('1 ')).toBe(true);
  });

  test('without overload, with filters', async({ mount, page, createSocket }) => {
    const hooksConfigWithFilter = {
      router: {
        query: { hash: CURRENT_ADDRESS, type: 'ERC-1155' },
      },
    };

    const API_URL_WITH_FILTER = buildApiUrl('address_token_transfers', { hash: CURRENT_ADDRESS }) + '?type=ERC-1155';

    await page.route(API_URL_WITH_FILTER, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig: hooksConfigWithFilter },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'token_transfer', { token_transfers: [ tokenTransferMock.erc1155B, tokenTransferMock.erc20 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);
  });

  test('with overload, with filters', async({ mount, page, createSocket }) => {
    const hooksConfigWithFilter = {
      router: {
        query: { hash: CURRENT_ADDRESS, type: 'ERC-1155' },
      },
    };

    const API_URL_WITH_FILTER = buildApiUrl('address_token_transfers', { hash: CURRENT_ADDRESS }) + '?type=ERC-1155';

    await page.route(API_URL_WITH_FILTER, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ tokenTransferMock.erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers overloadCount={ 2 }/>
      </TestApp>,
      { hooksConfig: hooksConfigWithFilter },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(
      socket,
      channel,
      'token_transfer',
      { token_transfers: [ tokenTransferMock.erc1155B, tokenTransferMock.erc20, tokenTransferMock.erc1155C, tokenTransferMock.erc721 ] },
    );

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);

    const counter = await page.locator('tbody tr:nth-child(1)').textContent();
    expect(counter?.startsWith('1 ')).toBe(true);
  });
});
