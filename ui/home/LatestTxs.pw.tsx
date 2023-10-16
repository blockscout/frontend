import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import LatestTxs from './LatestTxs';

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('default view', async({ mount, page }) => {
    await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        txMock.base,
        txMock.withContractCreation,
        txMock.withTokenTransfer,
        txMock.withWatchListNames,
      ]),
    }));

    const component = await mount(
      <TestApp>
        <LatestTxs/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test('default view +@dark-mode', async({ mount, page }) => {
  await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
      txMock.withWatchListNames,
    ]),
  }));

  const component = await mount(
    <TestApp>
      <LatestTxs/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('socket', () => {
  test.describe.configure({ mode: 'serial' });

  const hooksConfig = {
    router: {
      pathname: '/',
      query: {},
    },
  };

  test('new item', async({ mount, page, createSocket }) => {
    await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        txMock.base,
        txMock.withContractCreation,
        txMock.withTokenTransfer,
      ]),
    }));

    const component = await mount(
      <TestApp withSocket>
        <LatestTxs/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'transactions:new_transaction');
    socketServer.sendMessage(socket, channel, 'transaction', { transaction: 1 });

    await expect(component).toHaveScreenshot();
  });
});
