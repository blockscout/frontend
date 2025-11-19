import React from 'react';

import * as txMock from 'mocks/txs/tx';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test as base, expect, devices } from 'playwright/lib';

import LatestTxs from './LatestTxs';

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('default view', async({ render, mockApiResponse }) => {
    await mockApiResponse('general:homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
      txMock.withWatchListNames,
    ]);

    const component = await render(<LatestTxs/>);
    await expect(component).toHaveScreenshot();
  });
});

test('default view +@dark-mode', async({ render, mockApiResponse }) => {
  await mockApiResponse('general:homepage_txs', [
    txMock.base,
    txMock.withContractCreation,
    txMock.withTokenTransfer,
    txMock.withWatchListNames,
  ]);

  const component = await render(<LatestTxs/>);
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

  test('new item', async({ render, mockApiResponse, createSocket }) => {
    await mockApiResponse('general:homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]);

    const component = await render(<LatestTxs/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'transactions:new_transaction');
    socketServer.sendMessage(socket, channel, 'transaction', { transaction: 1 });
    await expect(component).toHaveScreenshot();
  });
});
