import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as addressCountersMock from 'mocks/address/counters';
import * as addressTabCountersMock from 'mocks/address/tabCounters';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';

import Address from './Address';

const hooksConfig = {
  router: {
    query: { hash: addressMock.hash },
  },
};

test.describe('fetched bytecode', () => {
  test('should refetch address query', async({ render, mockApiResponse, createSocket, page }) => {
    const addressApiUrl = await mockApiResponse('address', addressMock.validator, { pathParams: { hash: addressMock.hash } });
    await mockApiResponse('address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressMock.hash } });
    await mockApiResponse('address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressMock.hash } });
    await mockApiResponse('address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressMock.hash } });
    await render(<Address/>, { hooksConfig }, { withSocket: true });

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ addressMock.hash.toLowerCase() }`);
    socketServer.sendMessage(socket, channel, 'fetched_bytecode', { fetched_bytecode: '0x0123' });

    const request = await page.waitForRequest(addressApiUrl);

    expect(request).toBeTruthy();
  });
});
