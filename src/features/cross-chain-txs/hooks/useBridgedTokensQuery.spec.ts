// @vitest-environment jsdom

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor, wrapper } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

const responseInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const getRequestedSearchTerms = () => fetchMock.mock.calls
  .map(([ input ]) => new URL(String(input)))
  .filter((url) => url.pathname.endsWith('/bridged-tokens'))
  .map((url) => url.searchParams.get('q'));

describe('useBridgedTokensQuery (cross-chain)', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ items: [], next_page_params: null }), responseInit);
  });

  afterEach(cleanup);

  it('sends the search term from the URL to the bridged tokens API', async() => {
    await withEnvs(ENVS_MAP.crossChainTxs, async() => {
      routerStandIn.reset({ pathname: '/tokens', query: { tab: 'bridged', q: 'USDC' } });
      const { 'default': useBridgedTokensQuery } = await import('./useBridgedTokensQuery');

      const { result } = renderHook(() => useBridgedTokensQuery({ enabled: true }), { wrapper });

      expect(result.current.searchTerm).toBe('USDC');
      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ 'USDC' ]));
    });
  });

  it('refetches the bridged tokens with the term typed into the search input', async() => {
    await withEnvs(ENVS_MAP.crossChainTxs, async() => {
      routerStandIn.reset({ pathname: '/tokens', query: { tab: 'bridged' } });
      const { 'default': useBridgedTokensQuery } = await import('./useBridgedTokensQuery');

      const { result } = renderHook(() => useBridgedTokensQuery({ enabled: true }), { wrapper });
      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ null ]));

      act(() => result.current.onSearchTermChange('DAI'));

      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ null, 'DAI' ]));
      expect(result.current.searchTerm).toBe('DAI');
    });
  });
});
