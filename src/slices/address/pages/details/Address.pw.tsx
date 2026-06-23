import React from 'react';
import { numberToHex } from 'viem';

import * as addressMock from 'src/slices/address/mocks/address';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as addressCountersMock from 'src/slices/address/mocks/counters';
import * as addressTabCountersMock from 'src/slices/address/mocks/tab-counters';

import config from 'src/config';

import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Address from './Address';

const hooksConfig = {
  router: {
    query: { hash: addressParamMock.hash },
  },
};

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test.describe('fetched bytecode', () => {
  test('should refetch address query', async({ render, mockApiResponse, createSocket, page }) => {
    const addressApiUrl = await mockApiResponse('core:address', addressMock.validator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressParamMock.hash } });
    await render(<Address/>, { hooksConfig }, { withSocket: true });

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ addressParamMock.hash.toLowerCase() }`);
    socketServer.sendMessage(socket, channel, 'fetched_bytecode', { fetched_bytecode: '0x0123' });

    const request = await page.waitForRequest(addressApiUrl);

    expect(request).toBeTruthy();
  });
});

test('degradation view', async({ render, page, mockRpcResponse, mockApiResponse }) => {
  await mockApiResponse('core:address', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_tabs_counters', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_txs', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockRpcResponse([ {
    Method: 'eth_getBalance',
    Parameters: [ addressParamMock.hash, 'latest' ],
    ReturnType: numberToHex(1234567890123456),
  } ]);

  const component = await render(<Address/>, { hooksConfig });
  await page.waitForResponse(config.chain.rpcUrls[0]);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
