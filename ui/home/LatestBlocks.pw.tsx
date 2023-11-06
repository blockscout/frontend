import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import LatestBlocks from './LatestBlocks';

const STATS_API_URL = buildApiUrl('homepage_stats');
const BLOCKS_API_URL = buildApiUrl('homepage_blocks');

export const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      blockMock.base,
      blockMock.base2,
    ]),
  }));

  const component = await mount(
    <TestApp>
      <LatestBlocks/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

const testL2 = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.optimisticRollup) as any,
});

testL2('L2 view', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      blockMock.base,
      blockMock.base2,
    ]),
  }));

  const component = await mount(
    <TestApp>
      <LatestBlocks/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

const testNoReward = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.viewsEnvs.block.hiddenFields) as any,
});

testNoReward('no reward view', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      blockMock.base,
      blockMock.base2,
    ]),
  }));

  const component = await mount(
    <TestApp>
      <LatestBlocks/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with long block height', async({ mount, page }) => {
  await page.route(STATS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(BLOCKS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      {
        ...blockMock.base,
        height: 123456789012345,
      },
    ]),
  }));

  const component = await mount(
    <TestApp>
      <LatestBlocks/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('socket', () => {
  test.describe.configure({ mode: 'serial' });

  test('new item', async({ mount, page, createSocket }) => {
    await page.route(STATS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));
    await page.route(BLOCKS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        blockMock.base,
        blockMock.base2,
      ]),
    }));

    const component = await mount(
      <TestApp withSocket>
        <LatestBlocks/>
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
});
