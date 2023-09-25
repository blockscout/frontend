import { Box } from '@chakra-ui/react';
import { test as base, expect } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import AddressTxs from './AddressTxs';

const CURRENT_ADDRESS = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

const API_URL = buildApiUrl('address_txs', { hash: CURRENT_ADDRESS });

const hooksConfig = {
  router: {
    query: { hash: CURRENT_ADDRESS },
  },
};

base.describe('base view', () => {
  let component: Locator;

  base.beforeEach(async({ page, mount }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [
        txMock.base,
        {
          ...txMock.base,
          hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
        },
      ], next_page_params: { block: 1 } }),
    }));

    component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs/>
      </TestApp>,
      { hooksConfig },
    );
  });

  base('+@mobile', async() => {
    await expect(component).toHaveScreenshot();
  });

  base.describe('screen xl', () => {
    base.use({ viewport: configs.viewport.xl });

    base('', async() => {
      base.slow();
      await expect(component).toHaveScreenshot();
    });
  });
});

base.describe('socket', () => {
  const test = base.extend<socketServer.SocketServerFixture>({
    createSocket: socketServer.createSocket,
  });
  // FIXME
  // test cases which use socket cannot run in parallel since the socket server always run on the same port
  test.describe.configure({ mode: 'serial' });

  test('without overload', async({ mount, page, createSocket }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ txMock.base ], next_page_params: { block: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'transaction', { transactions: [ txMock.base2, txMock.base4 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(4);
  });

  test('with update', async({ mount, page, createSocket }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ txMock.pending ], next_page_params: { block: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'transaction', { transactions: [ txMock.base, txMock.base2 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);
  });

  test('with overload', async({ mount, page, createSocket }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ txMock.base ], next_page_params: { block: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs overloadCount={ 2 }/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'transaction', { transactions: [ txMock.base2, txMock.base3, txMock.base4 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);

    const counter = await page.locator('tbody tr:nth-child(1)').textContent();
    expect(counter?.startsWith('2 ')).toBe(true);
  });

  test('without overload, with filters', async({ mount, page, createSocket }) => {
    const hooksConfigWithFilter = {
      router: {
        query: { hash: CURRENT_ADDRESS, filter: 'from' },
      },
    };

    const API_URL_WITH_FILTER = buildApiUrl('address_txs', { hash: CURRENT_ADDRESS }) + '?filter=from';

    await page.route(API_URL_WITH_FILTER, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ txMock.base ], next_page_params: { block: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs/>
      </TestApp>,
      { hooksConfig: hooksConfigWithFilter },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'transaction', { transactions: [ txMock.base2, txMock.base4 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);
  });

  test('with overload, with filters', async({ mount, page, createSocket }) => {
    const hooksConfigWithFilter = {
      router: {
        query: { hash: CURRENT_ADDRESS, filter: 'from' },
      },
    };

    const API_URL_WITH_FILTER = buildApiUrl('address_txs', { hash: CURRENT_ADDRESS }) + '?filter=from';

    await page.route(API_URL_WITH_FILTER, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ txMock.base ], next_page_params: { block: 1 } }),
    }));

    await mount(
      <TestApp withSocket>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTxs overloadCount={ 2 }/>
      </TestApp>,
      { hooksConfig: hooksConfigWithFilter },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ CURRENT_ADDRESS.toLowerCase() }`);

    const itemsCount = await page.locator('tbody tr').count();
    expect(itemsCount).toBe(2);

    socketServer.sendMessage(socket, channel, 'transaction', { transactions: [ txMock.base2, txMock.base3, txMock.base4 ] });

    await page.waitForSelector('tbody tr:nth-child(3)');

    const itemsCountNew = await page.locator('tbody tr').count();
    expect(itemsCountNew).toBe(3);

    const counter = await page.locator('tbody tr:nth-child(1)').textContent();
    expect(counter?.startsWith('1 ')).toBe(true);
  });
});
