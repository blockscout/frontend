import React from 'react';

import * as verifiedAddressesMocks from 'mocks/account/verifiedAddresses';
import { token as contract } from 'mocks/address/address';
import { tokenInfo, tokenCounters, bridgedTokenA } from 'mocks/tokens/tokenInfo';
import * as socketServer from 'playwright/fixtures/socketServer';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect, devices } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import Token from './Token';

const hooksConfig = {
  router: {
    query: { hash: '1', tab: 'token_transfers' },
    isReady: true,
  },
};

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
base.describe.configure({ mode: 'serial' });

base.beforeEach(async({ mockApiResponse }) => {
  await mockApiResponse('token', tokenInfo, { pathParams: { hash: '1' } });
  await mockApiResponse('address', contract, { pathParams: { hash: '1' } });
  await mockApiResponse('token_counters', tokenCounters, { pathParams: { hash: '1' } });
  await mockApiResponse('token_transfers', { items: [], next_page_params: null }, { pathParams: { hash: '1' } });
});

base('base view', async({ render, page, createSocket }) => {
  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

base('with verified info', async({ render, page, createSocket, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId: '1', hash: '1' } });
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await page.getByRole('button', { name: /project info/i }).click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

const bridgedTokenTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture(storageState.ENVS.bridgedTokens),
});

bridgedTokenTest('bridged token', async({ render, page, createSocket, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('token', bridgedTokenA, { pathParams: { hash: '1' } });
  await mockApiResponse('address', contract, { pathParams: { hash: '1' } });
  await mockApiResponse('token_counters', tokenCounters, { pathParams: { hash: '1' } });
  await mockApiResponse('token_transfers', { items: [], next_page_params: null }, { pathParams: { hash: '1' } });
  await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId: '1', hash: '1' } });
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'tokens:1');
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(configs.adsBannerSelector) ],
    maskColor: configs.maskColor,
  });
});

base.describe('mobile', () => {
  base.use({ viewport: devices['iPhone 13 Pro'].viewport });

  base('base view', async({ render, page, createSocket }) => {
    const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'tokens:1');
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });

  base('with verified info', async({ render, page, createSocket, mockApiResponse, mockAssetResponse }) => {
    await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId: '1', hash: '1' } });
    await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

    const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'tokens:1');
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });
});
