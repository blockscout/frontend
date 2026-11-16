// @vitest-environment jsdom

import type { ClustersByAddressResponse } from 'src/features/name-services/clusters/types/api';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, cleanup, renderHook, waitFor, wrapper } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import withEnvs from 'vitest/utils/mockEnvs';

import { useAddressClusters } from './useAddressClusters';

const ADDRESS = '0x1234567890123456789012345678901234567890';
const BY_ADDRESS_PROCEDURE = '/v1/trpc/names.getNamesByOwnerAddress';

// .env.vitest turns the clusters feature on; an empty host turns it off again
const NO_CLUSTERS_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_CLUSTERS_API_HOST', '' ] ];

const CLUSTERS_RESPONSE: ClustersByAddressResponse = {
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

function requestedAddresses(): Array<unknown> {
  return fetchMock.mock.calls
    .map(([ input ]) => new URL(String(input)))
    .filter((url) => url.pathname.endsWith(BY_ADDRESS_PROCEDURE))
    .map((url) => JSON.parse(url.searchParams.get('input') ?? 'null'));
}

beforeEach(() => {
  fetchMock.mockResponse(JSON.stringify(CLUSTERS_RESPONSE), { headers: { 'Content-Type': 'application/json' } });
});

afterEach(cleanup);

describe('useAddressClusters', () => {
  it('fetches the clusters owned by the address', async() => {
    const { result } = renderHook(() => useAddressClusters(ADDRESS), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(CLUSTERS_RESPONSE));
    expect(requestedAddresses()).toEqual([ { address: ADDRESS } ]);
  });

  it('makes no request without an address', async() => {
    const { result } = renderHook(() => useAddressClusters(''), { wrapper });
    await act(flushPromises);

    expect(requestedAddresses()).toEqual([]);
    expect(result.current.data).toBeUndefined();
  });

  it('makes no request when the caller disables it', async() => {
    const { result } = renderHook(() => useAddressClusters(ADDRESS, false), { wrapper });
    await act(flushPromises);

    expect(requestedAddresses()).toEqual([]);
    expect(result.current.data).toBeUndefined();
  });

  it.each([
    [ 'no name service at all', NO_CLUSTERS_ENVS ],
    [ 'ENS but no clusters', [ ...ENVS_MAP.nameService, ...NO_CLUSTERS_ENVS ] ],
  ])('makes no request on an instance with %s', async(_, envs) => {
    await withEnvs(envs, async() => {
      const [ lib, { useAddressClusters: useAddressClustersWithEnvs } ] = await Promise.all([
        import('vitest/lib'),
        import('./useAddressClusters'),
      ]);

      const { result } = lib.renderHook(() => useAddressClustersWithEnvs(ADDRESS), { wrapper: lib.wrapper });
      await lib.act(flushPromises);

      expect(requestedAddresses()).toEqual([]);
      expect(result.current.data).toBeUndefined();
    });
  });
});
