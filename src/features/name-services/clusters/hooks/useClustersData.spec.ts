// @vitest-environment jsdom

import { findKey } from 'es-toolkit';

import type {
  ClusterByIdResponse,
  ClustersByAddressResponse,
  ClustersDirectoryResponse,
  ClustersLeaderboardResponse,
} from 'src/features/name-services/clusters/types/api';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, renderHook, waitFor, wrapper } from 'vitest/lib';

import { useClustersData } from './useClustersData';

const ADDRESS = '0x1234567890123456789012345678901234567890';
const OTHER_ADDRESS = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const ITEMS_PER_PAGE = 50;

const PROCEDURES = {
  leaderboard: 'names.leaderboard',
  directory: 'names.search',
  byAddress: 'names.getNamesByOwnerAddress',
  details: 'clusters.getClusterById',
} as const;

type Procedure = keyof typeof PROCEDURES;
type ProcedureInput = Record<string, unknown>;
type Reply = { readonly status: number; readonly body: unknown } | 'pending';
type Replies = Partial<Record<Procedure, (input: ProcedureInput) => Reply>>;

const LEADERBOARD_RESPONSE: ClustersLeaderboardResponse = {
  result: {
    data: [
      {
        name: 'alpha',
        clusterId: 'cluster-alpha',
        isTestnet: false,
        totalWeiAmount: '5000000000000000000',
        totalReferralAmount: '0',
        chainIds: [ '1' ],
        nameCount: '3',
        rank: 1,
      },
    ],
  },
};

const DIRECTORY_RESPONSE: ClustersDirectoryResponse = {
  result: {
    data: {
      total: 1,
      items: [
        {
          name: 'example',
          isTestnet: false,
          createdAt: '2024-01-01T00:00:00Z',
          owner: ADDRESS,
          totalWeiAmount: '1000000000000000000',
          updatedAt: '2024-01-02T00:00:00Z',
          updatedBy: ADDRESS,
          chainIds: [ '1' ],
        },
      ],
    },
  },
};

const BY_ADDRESS_RESPONSE: ClustersByAddressResponse = {
  result: {
    data: [
      {
        name: 'example/',
        owner: ADDRESS,
        totalWeiAmount: '1000000000000000000',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        updatedBy: ADDRESS,
        isTestnet: false,
        clusterId: 'cluster-1',
        expiresAt: null,
      },
    ],
  },
};

const DETAILS_RESPONSE: ClusterByIdResponse = {
  result: {
    data: {
      id: 'cluster-1',
      createdBy: ADDRESS,
      createdAt: '2024-01-01T00:00:00Z',
      wallets: [ { address: ADDRESS, name: 'main', chainIds: [ '1' ] } ],
      isTestnet: false,
    },
  },
};

function ok(body: unknown): Reply {
  return { status: 200, body };
}

function inputOf(url: URL): ProcedureInput {
  const input: unknown = JSON.parse(url.searchParams.get('input') ?? '{}');
  return typeof input === 'object' && input !== null ? Object.fromEntries(Object.entries(input)) : {};
}

function serveClustersApi(replies: Replies): void {
  fetchMock.mockResponse((request) => {
    const url = new URL(request.url);
    const procedure = findKey(PROCEDURES, (path) => url.pathname.endsWith(`/${ path }`));
    const reply = procedure ? replies[procedure]?.(inputOf(url)) : undefined;

    if (reply === 'pending') {
      return new Promise(() => {});
    }

    if (!reply) {
      return { status: 404, body: '{}' };
    }

    return { status: reply.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reply.body) };
  });
}

function requests(procedure: Procedure): Array<ProcedureInput> {
  return fetchMock.mock.calls
    .map(([ input ]) => new URL(String(input)))
    .filter((url) => url.pathname.endsWith(`/${ PROCEDURES[procedure] }`))
    .map(inputOf);
}

interface Props {
  readonly term: string;
  readonly viewMode: string;
  readonly page: number;
}

function renderClustersData(initialProps: Props) {
  return renderHook(({ term, viewMode, page }: Props) => useClustersData(term, viewMode, page), { wrapper, initialProps });
}

describe('useClustersData', () => {
  beforeEach(() => {
    serveClustersApi({
      leaderboard: () => ok(LEADERBOARD_RESPONSE),
      directory: () => ok(DIRECTORY_RESPONSE),
      byAddress: () => ok(BY_ADDRESS_RESPONSE),
      details: ({ id }) => id === 'cluster-1' ? ok(DETAILS_RESPONSE) : 'pending',
    });
  });

  afterEach(cleanup);

  describe('leaderboard', () => {
    it('fetches the first leaderboard page, ranked, and nothing else', async() => {
      const { result } = renderClustersData({ term: '', viewMode: 'leaderboard', page: 1 });

      await waitFor(() => expect(result.current.data).toEqual(LEADERBOARD_RESPONSE));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(requests('leaderboard')).toEqual([ { offset: 0, limit: ITEMS_PER_PAGE, orderBy: 'rank-asc' } ]);
      expect(requests('directory')).toEqual([]);
      expect(requests('byAddress')).toEqual([]);
      expect(requests('details')).toEqual([]);
    });

    it.each([
      [ 3, 100 ],
      [ 5, 200 ],
    ])('skips 50 clusters per page before page %i', async(page, offset) => {
      const { result } = renderClustersData({ term: '', viewMode: 'leaderboard', page });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(requests('leaderboard')).toEqual([ { offset, limit: ITEMS_PER_PAGE, orderBy: 'rank-asc' } ]);
    });

    it('shows placeholder rows until the first page arrives, then keeps it while the next page loads', async() => {
      serveClustersApi({ leaderboard: ({ offset }) => offset === 0 ? ok(LEADERBOARD_RESPONSE) : 'pending' });

      const { result, rerender } = renderClustersData({ term: '', viewMode: 'leaderboard', page: 1 });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data?.result.data).toHaveLength(ITEMS_PER_PAGE);

      await waitFor(() => expect(result.current.data).toEqual(LEADERBOARD_RESPONSE));
      expect(result.current.isLoading).toBe(false);

      rerender({ term: '', viewMode: 'leaderboard', page: 2 });

      await waitFor(() => expect(requests('leaderboard')).toHaveLength(2));
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toEqual(LEADERBOARD_RESPONSE);
    });

    it('reports a failed request', async() => {
      serveClustersApi({ leaderboard: () => ({ status: 500, body: {} }) });

      const { result } = renderClustersData({ term: '', viewMode: 'leaderboard', page: 1 });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe('directory', () => {
    it('lists the newest clusters when no search term is given', async() => {
      const { result } = renderClustersData({ term: '', viewMode: 'directory', page: 1 });

      await waitFor(() => expect(result.current.data).toEqual(DIRECTORY_RESPONSE));
      expect(result.current.isLoading).toBe(false);
      expect(requests('directory')).toEqual([ { offset: 0, limit: ITEMS_PER_PAGE, orderBy: 'createdAt-desc', query: '' } ]);
      expect(requests('leaderboard')).toEqual([]);
      expect(requests('byAddress')).toEqual([]);
    });

    it('searches cluster names alphabetically, even from the leaderboard view', async() => {
      const { result } = renderClustersData({ term: 'example', viewMode: 'leaderboard', page: 2 });

      await waitFor(() => expect(result.current.data).toEqual(DIRECTORY_RESPONSE));
      expect(requests('directory')).toEqual([ { offset: ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE, orderBy: 'name-asc', query: 'example' } ]);
      expect(requests('leaderboard')).toEqual([]);
      expect(requests('byAddress')).toEqual([]);
    });

    it('shows placeholder rows until the results arrive, then keeps them while a new search loads', async() => {
      serveClustersApi({ directory: ({ query }) => query === 'example' ? ok(DIRECTORY_RESPONSE) : 'pending' });

      const { result, rerender } = renderClustersData({ term: 'example', viewMode: 'directory', page: 1 });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data?.result.data).toHaveProperty('items.length', ITEMS_PER_PAGE);

      await waitFor(() => expect(result.current.data).toEqual(DIRECTORY_RESPONSE));
      expect(result.current.isLoading).toBe(false);

      rerender({ term: 'other', viewMode: 'directory', page: 1 });

      await waitFor(() => expect(requests('directory')).toHaveLength(2));
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toEqual(DIRECTORY_RESPONSE);
    });
  });

  describe('address search', () => {
    it('looks up the clusters the address owns and the details of the first one', async() => {
      const { result } = renderClustersData({ term: ADDRESS, viewMode: 'directory', page: 1 });

      await waitFor(() => expect(result.current.clusterDetails).toEqual(DETAILS_RESPONSE));
      expect(result.current).toEqual({
        data: BY_ADDRESS_RESPONSE,
        clusterDetails: DETAILS_RESPONSE,
        isError: false,
        isLoading: false,
        isClusterDetailsLoading: false,
      });
      expect(requests('byAddress')).toEqual([ { address: ADDRESS } ]);
      expect(requests('details')).toEqual([ { id: 'cluster-1' } ]);
      expect(requests('directory')).toEqual([]);
      expect(requests('leaderboard')).toEqual([]);
    });

    it('reports the cluster details as loading until they arrive', async() => {
      serveClustersApi({
        byAddress: () => ok(BY_ADDRESS_RESPONSE),
        details: () => 'pending',
      });

      const { result } = renderClustersData({ term: ADDRESS, viewMode: 'directory', page: 1 });

      await waitFor(() => expect(result.current.data).toEqual(BY_ADDRESS_RESPONSE));
      await waitFor(() => expect(requests('details')).toContainEqual({ id: 'cluster-1' }));
      expect(result.current.isClusterDetailsLoading).toBe(true);
      expect(result.current.clusterDetails).toBeUndefined();
    });

    it('shows placeholder rows until the clusters arrive, then keeps them while another address loads', async() => {
      serveClustersApi({ byAddress: ({ address }) => address === ADDRESS ? ok(BY_ADDRESS_RESPONSE) : 'pending' });

      const { result, rerender } = renderClustersData({ term: ADDRESS, viewMode: 'directory', page: 1 });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data?.result.data).toHaveLength(ITEMS_PER_PAGE);

      await waitFor(() => expect(result.current.data).toEqual(BY_ADDRESS_RESPONSE));
      expect(result.current.isLoading).toBe(false);

      rerender({ term: OTHER_ADDRESS, viewMode: 'directory', page: 1 });

      await waitFor(() => expect(requests('byAddress')).toHaveLength(2));
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toEqual(BY_ADDRESS_RESPONSE);
    });
  });

  it.each([
    [ 'the leaderboard', { term: '', viewMode: 'leaderboard', page: 1 } ],
    [ 'the directory', { term: '', viewMode: 'directory', page: 1 } ],
    [ 'a cluster name search', { term: 'example', viewMode: 'directory', page: 1 } ],
  ])('looks up no cluster details for %s', async(_, props) => {
    const { result } = renderClustersData(props);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(requests('byAddress')).toEqual([]);
    expect(requests('details')).toEqual([]);
    expect(result.current.clusterDetails).toBeUndefined();
  });
});
