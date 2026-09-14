// @vitest-environment jsdom

import React from 'react';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, beforeEach } from 'vitest';
import { render, renderHook, screen, waitFor, wrapper } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
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

  it('serves a consumer mounted later on the same page from the already fetched counters without a new request', async() => {
    const { useCrossChainCountersQuery } = await import('./useCrossChainCountersQuery');

    const Consumer = () => {
      const { data, fetchStatus } = useCrossChainCountersQuery();
      return <span data-testid="consumer">{ fetchStatus }:{ data?.totalInterchainMessages }</span>;
    };

    const { rerender } = render(<Consumer key="list"/>);
    await waitFor(() => expect(screen.getByTestId('consumer').textContent).toBe('idle:100'));

    // a different key unmounts the first consumer and mounts a fresh one under the same QueryClient
    rerender(<Consumer key="stats-widget"/>);
    await flushPromises();

    expect(screen.getByTestId('consumer').textContent).toBe('idle:100');
    expect(fetchMock).toHaveBeenCalledTimes(1);
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
