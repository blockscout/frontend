// @vitest-environment jsdom

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, cleanup, renderHook, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

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

  // withEnvs resets the module registry, so the stand-in must come from the same graph as the hook under test:
  // a statically imported one would provide a router context the re-evaluated facade never reads
  const loadModules = async() => {
    const [ { routerStandIn }, { 'default': useBridgedTokensQuery } ] = await Promise.all([
      import('vitest/utils/routerStandIn'),
      import('./useBridgedTokensQuery'),
    ]);
    return { routerStandIn, useBridgedTokensQuery };
  };

  it('sends the search term from the URL to the bridged tokens API', async() => {
    await withEnvs(ENVS_MAP.crossChainTxs, async() => {
      const { routerStandIn, useBridgedTokensQuery } = await loadModules();
      routerStandIn.reset({ pathname: '/tokens', query: { tab: 'bridged', q: 'USDC' } });

      const { result } = renderHook(() => useBridgedTokensQuery({ enabled: true }), { wrapper: routerStandIn.appWrapper });

      expect(result.current.searchTerm).toBe('USDC');
      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ 'USDC' ]));
    });
  });

  it('refetches the bridged tokens with the term typed into the search input', async() => {
    await withEnvs(ENVS_MAP.crossChainTxs, async() => {
      const { routerStandIn, useBridgedTokensQuery } = await loadModules();
      routerStandIn.reset({ pathname: '/tokens', query: { tab: 'bridged' } });

      const { result } = renderHook(() => useBridgedTokensQuery({ enabled: true }), { wrapper: routerStandIn.appWrapper });
      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ null ]));

      act(() => result.current.onSearchTermChange('DAI'));

      await waitFor(() => expect(getRequestedSearchTerms()).toEqual([ null, 'DAI' ]));
      expect(result.current.searchTerm).toBe('DAI');
    });
  });
});
