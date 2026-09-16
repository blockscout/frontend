// @vitest-environment jsdom

import { rpcBlockBase } from 'src/slices/block/mocks/rpc';
import { rpcTx, rpcTxReceipt } from 'src/slices/tx/mocks/rpc';
import { TX, TX_HASH } from 'src/slices/tx/stubs/tx';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, wrapper, cleanup, waitFor } from 'vitest/lib';
import { mockApiAndRpc, rpcRequests, apiRequests } from 'vitest/utils/mockJsonRpc';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

import useTxQuery from './useTxQuery';

const API_TX = { status: 200, body: JSON.stringify(TX) };
const API_NOT_FOUND = { status: 404, body: JSON.stringify({ message: 'Not found' }) };
const API_INVALID_HASH = { status: 422, body: JSON.stringify({ message: 'Invalid hash' }) };

const TX_BLOCK_NUMBER = '0x64';
const LATEST_BLOCK_NUMBER = '0x6e';
const EXPECTED_CONFIRMATIONS = 11;

const RPC_NODE_WITH_TX = {
  eth_getTransactionByHash: rpcTx,
  eth_getTransactionReceipt: { ...rpcTxReceipt, status: '0x1' },
  eth_getBlockByHash: { ...rpcBlockBase, number: TX_BLOCK_NUMBER },
  eth_getBlockByNumber: { ...rpcBlockBase, number: LATEST_BLOCK_NUMBER },
};

const RPC_RETRY_DELAY = 5_000;
const API_POLL_INTERVAL = 15_000;

beforeEach(() => {
  fetchMock.resetMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  routerStandIn.reset({ pathname: '/tx/[hash]', query: { hash: TX_HASH } });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useTxQuery', () => {
  it('serves the API transaction and never asks the RPC node', async() => {
    mockApiAndRpc({ api: () => API_TX });

    const { result } = renderHook(() => useTxQuery(), { wrapper });
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));

    expect(result.current.data?.hash).toBe(TX_HASH);
    expect(result.current.isDegradedData).toBe(false);
    expect(result.current.apiError).toBeNull();
    expect(rpcRequests()).toEqual([]);
  });

  it('reports a malformed hash straight away without asking the RPC node', async() => {
    mockApiAndRpc({ api: () => API_INVALID_HASH, rpc: RPC_NODE_WITH_TX });

    const { result } = renderHook(() => useTxQuery(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.status).toBe(422);
    expect(result.current.isDegradedData).toBe(false);
    expect(rpcRequests()).toEqual([]);
  });

  it('reports the API 404 once the RPC node does not know the transaction either', async() => {
    mockApiAndRpc({ api: () => API_NOT_FOUND });

    const { result } = renderHook(() => useTxQuery(), { wrapper });

    await waitFor(() => expect(rpcRequests()).toEqual([ 'eth_getTransactionByHash' ]));
    expect(result.current.isDegradedData).toBe(true);
    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.isError).toBe(false);

    // a slow indexer and a lagging node may both miss a fresh transaction, so the node is re-asked twice
    await vi.advanceTimersByTimeAsync(RPC_RETRY_DELAY);
    await vi.advanceTimersByTimeAsync(RPC_RETRY_DELAY);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.status).toBe(404);
    expect(result.current.isDegradedData).toBe(false);
    expect(rpcRequests()).toEqual([ 'eth_getTransactionByHash', 'eth_getTransactionByHash', 'eth_getTransactionByHash' ]);

    await vi.advanceTimersByTimeAsync(API_POLL_INTERVAL);
    expect(apiRequests()).toHaveLength(1);
  });

  it('serves a pending RPC transaction with no confirmations when the node has no receipt or block for it', async() => {
    mockApiAndRpc({
      api: () => API_NOT_FOUND,
      rpc: { eth_getTransactionByHash: rpcTx, eth_getBlockByNumber: RPC_NODE_WITH_TX.eth_getBlockByNumber },
    });

    const { result } = renderHook(() => useTxQuery(), { wrapper });
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));

    expect(result.current.isDegradedData).toBe(true);
    expect(result.current.data?.hash).toBe(TX_HASH);
    expect(result.current.data?.status).toBeNull();
    expect(result.current.data?.confirmations).toBe(0);
  });

  it('serves the RPC transaction on an API 404 and polls the API until it catches up', async() => {
    let apiResponse: typeof API_TX | Promise<typeof API_TX> = API_NOT_FOUND;
    mockApiAndRpc({ api: () => apiResponse, rpc: RPC_NODE_WITH_TX });

    const { result } = renderHook(() => useTxQuery(), { wrapper });
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));

    expect(result.current.isDegradedData).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data?.hash).toBe(TX_HASH);
    expect(result.current.data?.from.hash).toBe(rpcTx.from);
    expect(result.current.data?.status).toBe('ok');
    expect(result.current.data?.confirmations).toBe(EXPECTED_CONFIRMATIONS);
    expect(result.current.apiError?.status).toBe(404);
    expect(apiRequests()).toHaveLength(1);

    const { promise: pendingPoll, resolve: resolveApi } = Promise.withResolvers<typeof API_TX>();
    apiResponse = pendingPoll;
    await vi.advanceTimersByTimeAsync(API_POLL_INTERVAL);

    // the RPC data and the 404 verdict stay on screen while the poll is in flight
    expect(apiRequests()).toHaveLength(2);
    expect(result.current.isDegradedData).toBe(true);
    expect(result.current.data?.hash).toBe(TX_HASH);
    expect(result.current.apiError?.status).toBe(404);

    resolveApi(API_TX);
    await waitFor(() => expect(result.current.isDegradedData).toBe(false));
    expect(result.current.apiError).toBeNull();
    expect(result.current.data).toEqual(TX);

    await vi.advanceTimersByTimeAsync(API_POLL_INTERVAL);
    expect(apiRequests()).toHaveLength(2);
  });
});
