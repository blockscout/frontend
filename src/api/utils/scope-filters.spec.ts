import type { ApiResource } from '../resources/types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, test, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { ResourceName } from '../resources';
import { RESOURCES } from '../resources';

const INTERCHAIN_HOST = 'http://localhost:3014';
// NEXT_PUBLIC_NETWORK_ID in vitest/.env.vitest
const DEPLOYMENT_CHAIN_ID = '1';
const BRIDGE_IDS = '1,2';
const BRIDGE_IDS_ENCODED = encodeURIComponent(BRIDGE_IDS);
const PATH_PARAM_STUB = 'stub';
const NO_SCOPE_FILTERS: Array<string> = [];

const CROSS_CHAIN_ENVS = ENVS_MAP.crossChainTxs;
const MULTICHAIN_ENVS = [ ...ENVS_MAP.crossChainTxs, ...ENVS_MAP.multichain ];

const CLUSTER_CHAIN = { id: '10', slug: 'op-mainnet', name: 'OP Mainnet' } as unknown as ClusterChainConfig;

type BuildUrl = (
  resource: ResourceName,
  pathParams?: Record<string, string>,
  queryParams?: Record<string, string>,
  noProxy?: boolean,
  chain?: ExternalChainExtended,
) => string;

// the resource name and its path params are only known at runtime here, so buildUrl's per-resource
// generics cannot be satisfied — the registry walk below is the whole point of the test
const importBuildUrl = async() => (await import('./build-url')).default as unknown as BuildUrl;

function buildUrlWithEnvs(
  envs: Array<[ string, string ]>,
  resource: ResourceName,
  { pathParams, queryParams, chain }: {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
    chain?: ExternalChainExtended;
  } = {},
) {
  return withEnvs(envs, async() => {
    const buildUrl = await importBuildUrl();
    return buildUrl(resource, pathParams, queryParams, undefined, chain);
  });
}

describe('scope filter derivation', () => {
  test('multichain off — the deployment chain is the focal chain', async() => {
    const url = await buildUrlWithEnvs(CROSS_CHAIN_ENVS, 'interchainIndexer:messages');

    expect(url).toBe(`${ INTERCHAIN_HOST }/api/v1/interchain/messages?home_chain_id=1&include_unindexed_chains=false`);
  });

  test('multichain with a chain in scope — that chain is the focal chain, and no bridge_ids narrows it', async() => {
    const url = await buildUrlWithEnvs(MULTICHAIN_ENVS, 'interchainIndexer:messages', { chain: CLUSTER_CHAIN });

    expect(url).toBe(`${ INTERCHAIN_HOST }/api/v1/interchain/messages?home_chain_id=10&include_unindexed_chains=false`);
  });

  test('multichain aggregated — the deployment bridges scope the request', async() => {
    const url = await buildUrlWithEnvs(MULTICHAIN_ENVS, 'interchainIndexer:messages');

    expect(url).toBe(
      `${ INTERCHAIN_HOST }/api/v1/interchain/messages?bridge_ids=${ BRIDGE_IDS_ENCODED }&include_unindexed_chains=false`,
    );
  });

  test('include_unindexed_chains comes from its own env', async() => {
    const url = await buildUrlWithEnvs(
      [ ...CROSS_CHAIN_ENVS, [ 'NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS', 'true' ] ],
      'interchainIndexer:messages',
    );

    expect(url).toBe(`${ INTERCHAIN_HOST }/api/v1/interchain/messages?home_chain_id=1&include_unindexed_chains=true`);
  });

  test('message details declares no scope filter and carries none', async() => {
    const url = await buildUrlWithEnvs(CROSS_CHAIN_ENVS, 'interchainIndexer:message', { pathParams: { id: '0x123' } });

    expect(url).toBe(`${ INTERCHAIN_HOST }/api/v1/interchain/messages/0x123`);
  });

  test('the caller query params keep their place in front of the profile', async() => {
    const url = await buildUrlWithEnvs(CROSS_CHAIN_ENVS, 'interchainIndexer:messages', {
      queryParams: { q: 'duck', page_token: 'token' },
    });

    expect(url).toBe(
      `${ INTERCHAIN_HOST }/api/v1/interchain/messages?q=duck&page_token=token&home_chain_id=1&include_unindexed_chains=false`,
    );
  });

  test('a resource declaring bridge_ids only never sends home_chain_id', async() => {
    const url = await buildUrlWithEnvs(CROSS_CHAIN_ENVS, 'interchainIndexer:chains');

    expect(url).toBe(
      `${ INTERCHAIN_HOST }/api/v1/interchain/chains?bridge_ids=${ BRIDGE_IDS_ENCODED }&include_unindexed_chains=false`,
    );
  });
});

const INTERCHAIN_RESOURCES = Object.entries(RESOURCES.interchainIndexer) as Array<[ string, ApiResource ]>;

function pathParamsStub(resource: ApiResource) {
  return Object.fromEntries((resource.pathParams ?? []).map((param) => [ param, PATH_PARAM_STUB ]));
}

function expectedFocalChainProfile(scopeFilters: Array<string> = NO_SCOPE_FILTERS) {
  const chainPredicate = (() => {
    if (scopeFilters.includes('home_chain_id')) {
      return { home_chain_id: DEPLOYMENT_CHAIN_ID };
    }
    return scopeFilters.includes('bridge_ids') ? { bridge_ids: BRIDGE_IDS } : {};
  })();

  return {
    ...chainPredicate,
    ...(scopeFilters.includes('include_unindexed_chains') ? { include_unindexed_chains: 'false' } : {}),
  };
}

function expectedAggregatedProfile(scopeFilters: Array<string> = NO_SCOPE_FILTERS) {
  return {
    ...(scopeFilters.includes('bridge_ids') ? { bridge_ids: BRIDGE_IDS } : {}),
    ...(scopeFilters.includes('include_unindexed_chains') ? { include_unindexed_chains: 'false' } : {}),
  };
}

describe('every declared scope filter reaches the URL of every registered resource', () => {
  test.each(INTERCHAIN_RESOURCES)('interchainIndexer:%s on a focal-chain deployment', async(name, resource) => {
    const url = await buildUrlWithEnvs(CROSS_CHAIN_ENVS, `interchainIndexer:${ name }` as ResourceName, {
      pathParams: pathParamsStub(resource),
    });

    expect(Object.fromEntries(new URL(url).searchParams)).toEqual(expectedFocalChainProfile(resource.scopeFilters));
  });

  test.each(INTERCHAIN_RESOURCES)('interchainIndexer:%s on an aggregated multichain view', async(name, resource) => {
    const url = await buildUrlWithEnvs(MULTICHAIN_ENVS, `interchainIndexer:${ name }` as ResourceName, {
      pathParams: pathParamsStub(resource),
    });

    expect(Object.fromEntries(new URL(url).searchParams)).toEqual(expectedAggregatedProfile(resource.scopeFilters));
  });
});

describe('a declared scope filter with no resolver for its own service', () => {
  const FIXTURE_RESOURCE_NAME = 'scope_filter_fixture';
  const MISSPELLED_FILTER = 'bridge_id';

  const FIXTURE_RESOURCES = {
    interchainIndexer: {
      path: '/api/v1/interchain/fixture',
      scopeFilters: [ 'home_chain_id', MISSPELLED_FILTER ],
    },
    core: {
      path: '/api/v2/fixture',
      scopeFilters: [ 'home_chain_id', 'bridge_ids', 'include_unindexed_chains' ],
    },
  } satisfies Record<string, ApiResource>;

  type FixtureApiName = keyof typeof FIXTURE_RESOURCES;

  function buildUrlForFixtureResource(envs: Array<[ string, string ]>, apiName: FixtureApiName) {
    return withEnvs(envs, async() => {
      vi.doMock('../resources', async() => {
        const actual = await vi.importActual<{ RESOURCES: typeof RESOURCES }>('../resources');

        return {
          ...actual,
          RESOURCES: {
            ...actual.RESOURCES,
            [apiName]: { ...actual.RESOURCES[apiName], [FIXTURE_RESOURCE_NAME]: FIXTURE_RESOURCES[apiName] },
          },
        };
      });

      try {
        const buildUrl = await importBuildUrl();
        return buildUrl(`${ apiName }:${ FIXTURE_RESOURCE_NAME }` as ResourceName);
      } finally {
        vi.doUnmock('../resources');
      }
    });
  }

  test('is left out of the query string instead of failing the request', async() => {
    const url = await buildUrlForFixtureResource(CROSS_CHAIN_ENVS, 'interchainIndexer');

    expect(url).toBe(`${ INTERCHAIN_HOST }/api/v1/interchain/fixture?home_chain_id=${ DEPLOYMENT_CHAIN_ID }`);
  });

  test('does not inherit the interchain resolver of the same name', async() => {
    const url = await buildUrlForFixtureResource(CROSS_CHAIN_ENVS, 'core');

    expect(Object.fromEntries(new URL(url).searchParams)).toEqual({});
  });
});
