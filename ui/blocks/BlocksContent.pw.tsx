import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';

import BlocksContent from './BlocksContent';

const API_URL = '/node-api/blocks';

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp>
      <BlocksContent/>
    </TestApp>,
  );
  await page.waitForResponse(API_URL);

  await expect(component).toHaveScreenshot();
});

test('new item from socket', async({ mount, page, createSocket }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp withSocket>
      <BlocksContent/>
    </TestApp>,
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

  await expect(component).toHaveScreenshot();
});

test('socket error', async({ mount, page, createSocket }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp withSocket>
      <BlocksContent/>
    </TestApp>,
  );

  const socket = await createSocket();
  await socketServer.joinChannel(socket, 'blocks:new_block');
  socket.close();

  await expect(component).toHaveScreenshot();
});
