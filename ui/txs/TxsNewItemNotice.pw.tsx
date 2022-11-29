import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { ROUTES } from 'lib/link/routes';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';

import TxsNewItemNotice from './TxsNewItemNotice';

const hooksConfig = {
  router: {
    pathname: ROUTES.txs.pattern,
    query: {},
  },
};

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

test.describe.configure({ mode: 'serial' });

test('new item in validated txs list', async({ mount, createSocket }) => {
  const component = await mount(
    <TestApp withSocket>
      <TxsNewItemNotice/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'transactions:new_transaction');
  socketServer.sendMessage(socket, channel, 'transaction', { transaction: 1 });

  await expect(component).toHaveScreenshot();
});

test('2 new items in validated txs list', async({ mount, page, createSocket }) => {
  const component = await mount(
    <TestApp withSocket>
      <TxsNewItemNotice/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'transactions:new_transaction');
  socketServer.sendMessage(socket, channel, 'transaction', { transaction: 1 });
  socketServer.sendMessage(socket, channel, 'transaction', { transaction: 1 });

  await page.waitForSelector('text=2 more');

  await expect(component).toHaveScreenshot();
});

test('connection loss', async({ mount, createSocket }) => {
  const component = await mount(
    <TestApp withSocket>
      <TxsNewItemNotice/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  await socketServer.joinChannel(socket, 'transactions:new_transaction');
  socket.close();

  await expect(component).toHaveScreenshot();
});

test('fetching', async({ mount, createSocket }) => {
  const component = await mount(
    <TestApp withSocket>
      <TxsNewItemNotice/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  await socketServer.joinChannel(socket, 'transactions:new_transaction');

  await expect(component).toHaveScreenshot();
});
