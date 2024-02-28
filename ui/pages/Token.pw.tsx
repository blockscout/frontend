import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as verifiedAddressesMocks from 'mocks/account/verifiedAddresses';
import { token as contract } from 'mocks/address/address';
import { tokenInfo, tokenCounters, bridgedTokenA } from 'mocks/tokens/tokenInfo';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Token from './Token';

const TOKEN_API_URL = buildApiUrl('token', { hash: '1' });
const TOKEN_COUNTERS_API_URL = buildApiUrl('token_counters', { hash: '1' });
const TOKEN_TRANSFERS_API_URL = buildApiUrl('token_transfers', { hash: '1' });
const ADDRESS_API_URL = buildApiUrl('address', { hash: '1' });
const hooksConfig = {
  router: {
    query: { hash: '1', tab: 'token_transfers' },
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
    body: '',
  }));

  await page.route(TOKEN_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenInfo),
  }));
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contract),
  }));
  await page.route(TOKEN_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenCounters),
  }));
  await page.route(TOKEN_TRANSFERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({}),
  }));
});

test('base view', async({ mount, page, createSocket }) => {
  const component = await mount(
    <TestApp withSocket>
      <Token/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test('with verified info', async({ mount, page, createSocket }) => {
  const VERIFIED_INFO_URL = buildApiUrl('token_verified_info', { chainId: '1', hash: '1' });
  await page.route(VERIFIED_INFO_URL, (route) => route.fulfill({
    body: JSON.stringify(verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED),
  }));
  await page.route(tokenInfo.icon_url as string, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp withSocket>
      <Token/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await page.getByRole('button', { name: /project info/i }).click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

const bridgedTokenTest = base.extend<socketServer.SocketServerFixture>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.bridgedTokens) as any,
  createSocket: socketServer.createSocket,
});

bridgedTokenTest('bridged token', async({ mount, page, createSocket }) => {

  const VERIFIED_INFO_URL = buildApiUrl('token_verified_info', { chainId: '1', hash: '1' });

  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(TOKEN_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(bridgedTokenA),
  }));
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contract),
  }));
  await page.route(TOKEN_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokenCounters),
  }));
  await page.route(TOKEN_TRANSFERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({}),
  }));
  await page.route(VERIFIED_INFO_URL, (route) => route.fulfill({
    body: JSON.stringify(verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED),
  }));

  await page.route(tokenInfo.icon_url as string, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp withSocket>
      <Token/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', async({ mount, page, createSocket }) => {
    const component = await mount(
      <TestApp withSocket>
        <Token/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'tokens:1');
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });

  test('with verified info', async({ mount, page, createSocket }) => {
    const VERIFIED_INFO_URL = buildApiUrl('token_verified_info', { chainId: '1', hash: '1' });
    await page.route(VERIFIED_INFO_URL, (route) => route.fulfill({
      body: JSON.stringify(verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED),
    }));
    await page.route(tokenInfo.icon_url as string, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });

    const component = await mount(
      <TestApp withSocket>
        <Token/>
      </TestApp>,
      { hooksConfig },
    );

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'tokens:1');
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });
});
