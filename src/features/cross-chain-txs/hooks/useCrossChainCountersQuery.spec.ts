// @vitest-environment jsdom

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, wrapper } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

import { counters } from '../mocks/counters';

const STATS_API_HOST = 'https://localhost:3004';
const MULTICHAIN_STATS_API_HOST = 'http://localhost:3013';

const responseInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

describe('useCrossChainCountersQuery', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify(counters), responseInit);
  });

  it('reads the interchain counters from the single-chain stats service by id', async() => {
    const { useCrossChainCountersQuery } = await import('./useCrossChainCountersQuery');

    const { result } = renderHook(() => useCrossChainCountersQuery(), { wrapper });

    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.data?.totalInterchainMessages).toBeDefined();

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));

    expect(fetchMock.mock.calls[0][0]).toBe(`${ STATS_API_HOST }/api/v1/counters`);
    expect(result.current.data).toEqual({
      totalInterchainMessages: '100',
      newMessagesInterchain24h: '42',
      totalInterchainTransfers: '101',
      newTransfersInterchain24h: '55',
    });
  });

  it('reads the counters from the multichain stats service on a multichain deployment', async() => {
    await withEnvs(ENVS_MAP.multichain, async() => {
      const { useCrossChainCountersQuery } = await import('./useCrossChainCountersQuery');

      const { result } = renderHook(() => useCrossChainCountersQuery(), { wrapper });

      await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));

      expect(fetchMock.mock.calls[0][0]).toBe(`${ MULTICHAIN_STATS_API_HOST }/api/v1/counters`);
      expect(result.current.data?.totalInterchainMessages).toBe('100');
    });
  });

  it('returns no data and no placeholder when no stats service is configured', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_STATS_API_HOST', '' ] ], async() => {
      const { useCrossChainCountersQuery } = await import('./useCrossChainCountersQuery');

      const { result } = renderHook(() => useCrossChainCountersQuery(), { wrapper });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPlaceholderData).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
