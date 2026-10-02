// @vitest-environment jsdom

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { SocketProvider } from 'src/api/socket/context';

import * as tokenTransferMock from 'src/slices/token-transfer/mocks';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act, waitFor } from 'vitest/lib';
import { MOCK_SOCKET_URL, sendSocketMessage } from 'vitest/utils/mockSocket';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
vi.mock('phoenix', () => import('vitest/utils/mockSocket').then((m) => m.phoenixModule));

import AddressTokenTransfers from './AddressTokenTransfers';

const CURRENT_ADDRESS = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';
const TOPIC = `addresses:${ CURRENT_ADDRESS.toLowerCase() }`;

const LIST_RESPONSE = {
  items: [ tokenTransferMock.erc1155A ],
  next_page_params: { block_number: 1, index: 1, items_count: 1 },
};

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponse((request) => {
    if (request.url.includes(`/addresses/${ CURRENT_ADDRESS }/token-transfers`)) {
      return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(LIST_RESPONSE) };
    }
    return { status: 404, body: '{}' };
  });
});

afterEach(cleanup);

async function renderTab(query: Record<string, string>, overloadCount?: number) {
  routerStandIn.reset({ pathname: '/address/[hash]', query: { hash: CURRENT_ADDRESS, tab: 'token_transfers', ...query } });
  render(
    <SocketProvider url={ MOCK_SOCKET_URL }>
      <AddressTokenTransfers overloadCount={ overloadCount }/>
    </SocketProvider>,
  );
  // the listed transfer plus the socket notice row
  await waitFor(() => expect(getRows()).toHaveLength(2));
}

function getRows() {
  return document.querySelectorAll('tbody tr');
}

function sendTransfers(transfers: Array<schemas['TokenTransfer']>) {
  act(() => {
    sendSocketMessage(TOPIC, 'token_transfer', { token_transfers: transfers });
  });
}

describe('address token transfers tab, live updates', () => {
  it('prepends new transfers to the table', async() => {
    await renderTab({});

    sendTransfers([ tokenTransferMock.erc1155B, tokenTransferMock.erc1155C ]);

    await waitFor(() => expect(getRows()).toHaveLength(4));
  });

  it('counts transfers in the notice instead of adding rows once the list is full', async() => {
    await renderTab({}, 2);

    sendTransfers([ tokenTransferMock.erc1155B, tokenTransferMock.erc1155C ]);

    expect(await screen.findByText('1 more token transfer')).toBeTruthy();
    expect(getRows()).toHaveLength(3);
  });

  it('adds only the transfers that match the type filter', async() => {
    await renderTab({ type: 'ERC-1155' });

    sendTransfers([ tokenTransferMock.erc1155B, tokenTransferMock.erc20 ]);

    await waitFor(() => expect(getRows()).toHaveLength(3));
  });

  it('counts only the transfers that match the type filter once the list is full', async() => {
    await renderTab({ type: 'ERC-1155' }, 2);

    sendTransfers([ tokenTransferMock.erc1155B, tokenTransferMock.erc20, tokenTransferMock.erc1155C, tokenTransferMock.erc721 ]);

    expect(await screen.findByText('1 more token transfer')).toBeTruthy();
    expect(getRows()).toHaveLength(3);
  });
});
