// @vitest-environment jsdom

import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import { routerStandIn } from 'vitest/utils/routerStandIn';

import useBlockWithdrawalsQuery from './useBlockWithdrawalsQuery';

const BLOCK_HEIGHT = '9004925';

const loadedBlockQuery = { isPlaceholderData: false, isDegradedData: false } as BlockQuery;

beforeEach(() => {
  fetchMock.resetMocks();
  routerStandIn.reset({ pathname: '/block/[height_or_hash]', query: { height_or_hash: BLOCK_HEIGHT, tab: 'withdrawals' } });
});

afterEach(cleanup);

describe('useBlockWithdrawalsQuery', () => {
  it('stays on the placeholder without requests when the beacon chain feature is off', async() => {
    const { result } = renderHook(
      () => useBlockWithdrawalsQuery({ heightOrHash: BLOCK_HEIGHT, blockQuery: loadedBlockQuery, tab: 'withdrawals' }),
      { wrapper: routerStandIn.appWrapper },
    );
    await act(flushPromises);

    expect(fetchMock.mock.calls).toHaveLength(0);
    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.isDegradedData).toBe(false);
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pagination).toMatchObject({ page: 1, isLoading: true });
  });
});
