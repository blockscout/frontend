import React from 'react';

import config from 'configs/app';
import * as verifiedAddressesMocks from 'mocks/account/verifiedAddresses';
import { token as contract } from 'mocks/address/address';
import { tokenInfo, tokenCounters, bridgedTokenA } from 'mocks/tokens/tokenInfo';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Token from './Token';

const hash = tokenInfo.address;
const chainId = config.chain.id;

const hooksConfig = {
  router: {
    query: { hash, tab: 'token_transfers' },
    isReady: true,
  },
};

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test.beforeEach(async({ mockApiResponse, mockTextAd }) => {
  await mockApiResponse('token', tokenInfo, { pathParams: { hash } });
  await mockApiResponse('address', contract, { pathParams: { hash } });
  await mockApiResponse('token_counters', tokenCounters, { pathParams: { hash } });
  await mockApiResponse('token_transfers', { items: [], next_page_params: null }, { pathParams: { hash } });
  await mockTextAd();
});

test('base view', async({ render, page, createSocket }) => {
  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, `tokens:${ hash }`);
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with verified info', async({ render, page, createSocket, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId, hash } });
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, `tokens:${ hash }`);
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await page.getByRole('button', { name: /project info/i }).click();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('bridged token', async({ render, page, createSocket, mockApiResponse, mockAssetResponse, mockEnvs }) => {
  const hash = bridgedTokenA.address;
  const hooksConfig = {
    router: {
      query: { hash, tab: 'token_transfers' },
    },
  };

  await mockEnvs(ENVS_MAP.bridgedTokens);
  await mockApiResponse('token', bridgedTokenA, { pathParams: { hash } });
  await mockApiResponse('address', contract, { pathParams: { hash } });
  await mockApiResponse('token_counters', tokenCounters, { pathParams: { hash } });
  await mockApiResponse('token_transfers', { items: [], next_page_params: null }, { pathParams: { hash } });
  await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId, hash } });
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, `tokens:${ hash.toLowerCase() }`);
  socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, page, createSocket }) => {
    const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `tokens:${ hash }`);
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });

  test('with verified info', async({ render, page, createSocket, mockApiResponse, mockAssetResponse }) => {
    await mockApiResponse('token_verified_info', verifiedAddressesMocks.TOKEN_INFO_APPLICATION.APPROVED, { pathParams: { chainId, hash } });
    await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

    const component = await render(<Token/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `tokens:${ hash }`);
    socketServer.sendMessage(socket, channel, 'total_supply', { total_supply: 10 ** 20 });

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
