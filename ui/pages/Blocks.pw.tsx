import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import * as blockMock from 'mocks/blocks/block';
import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Blocks from './Blocks';

const BLOCKS_API_URL = buildApiUrl('blocks') + '?type=block';
const STATS_API_URL = buildApiUrl('stats');
const hooksConfig = {
  router: {
    query: { tab: 'blocks' },
    isReady: true,
  },
};

const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('base view +@dark-mode', async({ mount, page }) => {
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

  await expect(component).toHaveScreenshot();
});

const hiddenFieldsTest = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.viewsEnvs.block.hiddenFields) as any,
});

hiddenFieldsTest('hidden fields', async({ mount, page }) => {
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

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test(' base view', async({ mount, page }) => {
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

    await expect(component).toHaveScreenshot();
  });

  const hiddenFieldsTest = test.extend({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: contextWithEnvs(configs.viewsEnvs.block.hiddenFields) as any,
  });

  hiddenFieldsTest('hidden fields', async({ mount, page }) => {
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

    await expect(component).toHaveScreenshot();
  });
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

  await expect(component).toHaveScreenshot();
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

  await expect(component).toHaveScreenshot();
});
