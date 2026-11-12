// @vitest-environment jsdom

import type { ClusterByNameResponse, SearchResultCluster } from 'src/features/name-services/clusters/types/api';
import type { QuickSearchResult } from 'src/slices/search/types/api';

import { address1, noRedirect } from 'src/slices/search/mocks';

import { SECOND } from 'src/toolkit/utils/consts';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor, wrapper } from 'vitest/lib';

import useSearchWithClusters from './useSearchWithClusters';

const SEARCH_DEBOUNCE = 0.3 * SECOND;
const OWNER = '0x1234567890123456789012345678901234567890';

const QUICK_SEARCH_PATH = '/api/v2/search/quick';
const CHECK_REDIRECT_PATH = '/api/v2/search/check-redirect';
const CLUSTER_BY_NAME_PATH = '/v1/trpc/names.get';

type Reply = { readonly status: number; readonly body: unknown } | 'pending';
type Replies = Readonly<Record<string, (url: URL) => Reply>>;

const QUICK_SEARCH_RESPONSE: QuickSearchResult = [ address1 ];

const CLUSTER_RESPONSE: ClusterByNameResponse = {
  result: {
    data: {
      name: 'test-cluster',
      owner: OWNER,
      clusterId: 'cluster-123',
      backingWei: '1000000000000000000',
      expiresAt: '2025-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      updatedBy: OWNER,
      isTestnet: false,
    },
  },
};

const CLUSTER_RESULT: SearchResultCluster = {
  type: 'cluster',
  name: 'test-cluster',
  address_hash: OWNER,
  is_smart_contract_verified: false,
  is_smart_contract_address: false,
  cluster_info: {
    cluster_id: 'cluster-123',
    name: 'test-cluster',
    owner: OWNER,
    created_at: '2024-01-01T00:00:00Z',
    expires_at: '2025-01-01T00:00:00Z',
    total_wei_amount: '1000000000000000000',
    is_testnet: false,
  },
};

const DEFAULT_REPLIES: Replies = {
  [QUICK_SEARCH_PATH]: () => ok(QUICK_SEARCH_RESPONSE),
  [CHECK_REDIRECT_PATH]: () => ok(noRedirect),
  [CLUSTER_BY_NAME_PATH]: () => ok(CLUSTER_RESPONSE),
};

function ok(body: unknown): Reply {
  return { status: 200, body };
}

function serveApis(replies: Replies): void {
  fetchMock.mockResponse((request) => {
    const url = new URL(request.url);
    const reply = Object.entries(replies).find(([ path ]) => url.pathname.endsWith(path))?.[1](url);

    if (reply === 'pending') {
      return new Promise(() => {});
    }

    if (!reply) {
      return { status: 404, body: '{}' };
    }

    return { status: reply.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reply.body) };
  });
}

function requestedUrls(path: string): Array<URL> {
  return fetchMock.mock.calls
    .map(([ input ]) => new URL(String(input)))
    .filter((url) => url.pathname.endsWith(path));
}

function requestedClusterLookups(): Array<unknown> {
  return requestedUrls(CLUSTER_BY_NAME_PATH).map((url): unknown => JSON.parse(url.searchParams.get('input') ?? '{}'));
}

function requestedQuickSearchTerms(): Array<string | null> {
  return requestedUrls(QUICK_SEARCH_PATH).map((url) => url.searchParams.get('q'));
}

type HookResult = { readonly current: ReturnType<typeof useSearchWithClusters> };

function renderSearch() {
  return renderHook(() => useSearchWithClusters(), { wrapper });
}

async function search(result: HookResult, term: string): Promise<void> {
  act(() => result.current.handleSearchTermChange(term));
  await act(() => vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE));
}

describe('useSearchWithClusters', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    serveApis(DEFAULT_REPLIES);
  });

  afterEach(cleanup);

  describe('cluster search', () => {
    it.each([
      [ 'test-cluster/', 'test-cluster' ],
      [ 'campnetwork/lol', 'campnetwork/lol' ],
      [ 'campnetwork/lol/', 'campnetwork/lol' ],
      [ '  my-cluster/  ', 'my-cluster' ],
      [ '  spaced/cluster/  ', 'spaced/cluster' ],
      [ 'test-cluster-123/', 'test-cluster-123' ],
      [ 'my_cluster_123/', 'my_cluster_123' ],
      [ 'ClusterWithCaps/', 'ClusterWithCaps' ],
      [ 'org/team/project', 'org/team/project' ],
      [ 'path/to/cluster/', 'path/to/cluster' ],
    ])('looks up "%s" as the cluster "%s"', async(term, clusterName) => {
      const { result } = renderSearch();

      await search(result, term);

      await waitFor(() => expect(requestedClusterLookups()).toEqual([ { name: clusterName } ]));
    });

    it('returns the cluster as a search result in place of the quick search results', async() => {
      const { result } = renderSearch();

      await search(result, 'test-cluster/');

      await waitFor(() => expect(result.current.query.data).toEqual([ CLUSTER_RESULT ]));
    });

    it('falls back to the cluster name for a cluster without an id and leaves the missing details empty', async() => {
      serveApis({
        ...DEFAULT_REPLIES,
        [CLUSTER_BY_NAME_PATH]: () => ok({ result: { data: { name: 'simple-cluster', owner: OWNER } } }),
      });
      const { result } = renderSearch();

      await search(result, 'simple-cluster/');

      await waitFor(() => expect(result.current.query.data).toEqual([ {
        type: 'cluster',
        name: 'simple-cluster',
        address_hash: OWNER,
        is_smart_contract_verified: false,
        is_smart_contract_address: false,
        cluster_info: {
          cluster_id: 'simple-cluster',
          name: 'simple-cluster',
          owner: OWNER,
          created_at: undefined,
          expires_at: undefined,
          total_wei_amount: undefined,
          is_testnet: undefined,
        },
      } ]));
    });

    it('returns no results when the clusters API fails', async() => {
      serveApis({ ...DEFAULT_REPLIES, [CLUSTER_BY_NAME_PATH]: () => ({ status: 500, body: {} }) });
      const { result } = renderSearch();

      await search(result, 'nonexistent-cluster/');

      await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
      expect(result.current.query.data).toEqual([]);
      expect(result.current.query.isError).toBe(false);
    });

    it('returns no results when the clusters API knows no such cluster', async() => {
      serveApis({ ...DEFAULT_REPLIES, [CLUSTER_BY_NAME_PATH]: () => ok({ result: { data: null } }) });
      const { result } = renderSearch();

      await search(result, 'empty-cluster/');

      await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
      expect(result.current.query.data).toEqual([]);
    });

    it('is loading until the cluster arrives', async() => {
      serveApis({ ...DEFAULT_REPLIES, [CLUSTER_BY_NAME_PATH]: () => 'pending' });
      const { result } = renderSearch();

      await search(result, 'loading-cluster/');

      await waitFor(() => expect(requestedClusterLookups()).toEqual([ { name: 'loading-cluster' } ]));
      expect(result.current.query.isLoading).toBe(true);
    });

    it('looks up nothing for a lone slash', async() => {
      const { result } = renderSearch();

      await search(result, '/');

      await waitFor(() => expect(requestedQuickSearchTerms()).toEqual([ '/' ]));
      expect(requestedClusterLookups()).toEqual([]);
    });
  });

  describe('regular search', () => {
    it('returns the quick search results for a term without a slash', async() => {
      const { result } = renderSearch();

      await search(result, 'test-cluster');

      await waitFor(() => expect(result.current.query.data).toEqual(QUICK_SEARCH_RESPONSE));
      expect(requestedQuickSearchTerms()).toEqual([ 'test-cluster' ]);
      expect(requestedClusterLookups()).toEqual([]);
    });

    it('is loading until the quick search results arrive', async() => {
      serveApis({ ...DEFAULT_REPLIES, [QUICK_SEARCH_PATH]: () => 'pending' });
      const { result } = renderSearch();

      await search(result, 'regular search');

      await waitFor(() => expect(requestedQuickSearchTerms()).toEqual([ 'regular search' ]));
      expect(result.current.query.isLoading).toBe(true);
      expect(result.current.query.isFetching).toBe(true);
    });

    it('reports a failed quick search', async() => {
      serveApis({ ...DEFAULT_REPLIES, [QUICK_SEARCH_PATH]: () => ({ status: 500, body: { message: 'Network error' } }) });
      const { result } = renderSearch();

      await search(result, 'error-search');

      await waitFor(() => expect(result.current.query.isError).toBe(true));
      expect(result.current.query.error).toMatchObject({ status: 500, payload: { message: 'Network error' } });
    });

    it('passes the redirect check through', async() => {
      const redirect = { parameter: OWNER, redirect: true, type: 'address' };
      serveApis({ ...DEFAULT_REPLIES, [CHECK_REDIRECT_PATH]: () => ok(redirect) });
      const { result } = renderSearch();

      await search(result, OWNER);

      await waitFor(() => expect(result.current.redirectCheckQuery.data).toEqual(redirect));
    });
  });

  describe('debouncing', () => {
    it('makes no request before anything is typed', async() => {
      renderSearch();

      await act(() => vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE));

      expect(fetchMock.mock.calls).toEqual([]);
    });

    it('searches only the term typed last within the debounce delay', async() => {
      const { result } = renderSearch();

      act(() => result.current.handleSearchTermChange('original-term/'));
      act(() => result.current.handleSearchTermChange('final-cluster/'));
      await act(() => vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE));

      await waitFor(() => expect(requestedClusterLookups()).toEqual([ { name: 'final-cluster' } ]));
      expect(requestedQuickSearchTerms()).toEqual([ 'final-cluster/' ]);
    });

    it('shows the typed term straight away while the search still runs on the previous one', async() => {
      const { result } = renderSearch();

      await search(result, 'debounced/');
      act(() => result.current.handleSearchTermChange('original-term'));

      expect(result.current.searchTerm).toBe('original-term');
      expect(result.current.debouncedSearchTerm).toBe('debounced/');
    });
  });
});
