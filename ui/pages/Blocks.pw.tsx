import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as statsMock from 'mocks/stats/index';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';

import Blocks from './Blocks';

const BLOCKS_API_URL = '/node-api/blocks';
const STATS_API_URL = '/node-api/stats';
const hooksConfig = {
  router: {
    query: { tab: 1 },
    isReady: true,
  },
};

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <Blocks/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(BLOCKS_API_URL);

  await expect(component.locator('main')).toHaveScreenshot();
});

test('new item from socket', async({ mount, page, createSocket }) => {
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp withSocket>
      <Blocks/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'blocks:new_block');
  socketServer.sendMessage(socket, channel, 'new_block', {
    average_block_time: '6212.0',
    block: {
      ...blockMock.base,
      height: blockMock.base.height + 1,
      timestamp: '2022-11-11T11:59:58Z',
    },
  });

  await expect(component.locator('main')).toHaveScreenshot();
});

test('socket error', async({ mount, page, createSocket }) => {
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp withSocket>
      <Blocks/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  await socketServer.joinChannel(socket, 'blocks:new_block');
  socket.close();

  await expect(component.locator('main')).toHaveScreenshot();
});
