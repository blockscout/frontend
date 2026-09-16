// @vitest-environment jsdom

import React from 'react';

import { rpcTx } from 'src/slices/tx/mocks/rpc';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

import AppErrorBoundary from 'src/shared/errors/AppErrorBoundary';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from 'vitest/lib';
import { mockApiAndRpc, rpcRequests, apiRequests } from 'vitest/utils/mockJsonRpc';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

import Transaction from './Transaction';

const API_NOT_FOUND = { status: 404, body: JSON.stringify({ message: 'Not found' }) };

const TX_NOT_FOUND_TITLE = 'Sorry, we are unable to locate this transaction hash';
const DATA_SYNC_ALERT = /Data sync in progress/;
const GENERIC_ERROR_ALERT = /Something went wrong/;

const RPC_RETRY_DELAY = 5_000;

beforeEach(() => {
  fetchMock.resetMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // the boundary re-throws the page error to the console; keep the run readable
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function renderPage(tab: string) {
  routerStandIn.reset({ pathname: '/tx/[hash]', query: { hash: TX_HASH, tab } });
  return render(<AppErrorBoundary><Transaction/></AppErrorBoundary>);
}

describe('tx page on an API 404', () => {
  it('shows the not-found screen on a non-details tab once the RPC node does not know the transaction', async() => {
    mockApiAndRpc({ api: () => API_NOT_FOUND });
    renderPage('token_transfers');

    await waitFor(() => expect(rpcRequests()).toEqual([ 'eth_getTransactionByHash' ]));
    await vi.advanceTimersByTimeAsync(RPC_RETRY_DELAY);
    await vi.advanceTimersByTimeAsync(RPC_RETRY_DELAY);

    expect(await screen.findByText(TX_NOT_FOUND_TITLE)).toBeTruthy();
    expect(screen.queryByText(GENERIC_ERROR_ALERT)).toBeNull();
    expect(apiRequests().some((url) => url.includes('/token-transfers'))).toBe(false);
  });

  it('shows the data-sync alert on a non-details tab while the RPC node serves the transaction', async() => {
    mockApiAndRpc({ api: () => API_NOT_FOUND, rpc: { eth_getTransactionByHash: rpcTx } });
    renderPage('logs');

    expect(await screen.findByText(DATA_SYNC_ALERT)).toBeTruthy();
    expect(screen.queryByText(TX_NOT_FOUND_TITLE)).toBeNull();
    expect(screen.queryByText(GENERIC_ERROR_ALERT)).toBeNull();
    expect(apiRequests().some((url) => url.includes('/logs'))).toBe(false);
  });
});
