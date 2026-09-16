// @vitest-environment jsdom

import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, wrapper, act, cleanup } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

import type { BlockQuery } from './useBlockQuery';
import useBlockTxsQuery from './useBlockTxsQuery';

const BLOCK_HEIGHT = '9004925';
const RESPONSE = { items: [ TX_ITEM ], next_page_params: null };
const RESPONSE_INIT = { headers: { 'Content-Type': 'application/json' } };

const loadedBlockQuery = { isPlaceholderData: false, isDegradedData: false } as BlockQuery;

beforeEach(() => {
  fetchMock.resetMocks();
  routerStandIn.reset({ pathname: '/block/[height_or_hash]', query: { height_or_hash: BLOCK_HEIGHT, tab: 'txs' } });
});

afterEach(cleanup);

describe('useBlockTxsQuery', () => {
  it('serves the API transactions with pagination once the block is loaded', async() => {
    fetchMock.mockResponse(JSON.stringify(RESPONSE), RESPONSE_INIT);

    const { result } = renderHook(() => useBlockTxsQuery({ heightOrHash: BLOCK_HEIGHT, blockQuery: loadedBlockQuery, tab: 'txs' }), { wrapper });
    await waitForApiResponse();

    expect(result.current.data).toEqual(RESPONSE);
    expect(result.current.isDegradedData).toBe(false);
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pagination).toMatchObject({ page: 1, hasNextPage: false, isLoading: false });
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(`/blocks/${ BLOCK_HEIGHT }/transactions`);
  });

  it('does not request anything while another tab is active', async() => {
    const { result } = renderHook(() => useBlockTxsQuery({ heightOrHash: BLOCK_HEIGHT, blockQuery: loadedBlockQuery, tab: 'index' }), { wrapper });
    await waitForApiResponse();

    expect(fetchMock.mock.calls).toHaveLength(0);
    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.isDegradedData).toBe(false);
  });
});

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}
