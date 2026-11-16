import type { SearchResultItem } from 'src/slices/search/types/client';

import * as searchMock from 'src/slices/search/mocks';

import { tacOperation1 } from 'src/features/chain-variants/tac/mocks/search';
import { zetaChainCCTXItem } from 'src/features/chain-variants/zeta-chain/mocks/cctx';
import { blob1 } from 'src/features/data-availability/mocks/search';
import { domain1 } from 'src/features/name-services/domains/mocks/search';
import { userOp1 } from 'src/features/user-ops/mocks/search';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type * as Utils from './search-results';

const NO_FEATURES = undefined;
const HASH = '0x3d2c1b0a9f8e7d6c5b4a39281706f5e4d3c2b1a0f9e8d7c6b5a4938271605f4e';

function withUtils<T>(envs: Array<[ string, string ]> | undefined, fn: (utils: typeof Utils) => T): Promise<T> {
  return withEnvs(envs, async() => fn(await import('./search-results')));
}

describe('getRedirectRoute', () => {
  it('returns nothing when the backend does not ask for a redirect', async() => {
    const route = await withUtils(NO_FEATURES, ({ getRedirectRoute }) => getRedirectRoute(searchMock.noRedirect));
    expect(route).toBeUndefined();
  });

  it('returns nothing when the redirect has no parameter', async() => {
    const route = await withUtils(NO_FEATURES, ({ getRedirectRoute }) => getRedirectRoute({ redirect: true, type: 'block', parameter: null }));
    expect(route).toBeUndefined();
  });

  it.each([
    [ 'block', { pathname: '/block/[height_or_hash]', query: { height_or_hash: HASH } } ],
    [ 'address', { pathname: '/address/[hash]', query: { hash: HASH } } ],
    [ 'transaction', { pathname: '/tx/[hash]', query: { hash: HASH } } ],
  ] as const)('routes a %s redirect without any feature flag', async(type, expected) => {
    const route = await withUtils(NO_FEATURES, ({ getRedirectRoute }) => getRedirectRoute({ redirect: true, type, parameter: HASH }));
    expect(route).toEqual(expected);
  });

  it.each([
    [ 'user_operation', ENVS_MAP.userOps, { pathname: '/op/[hash]', query: { hash: HASH } } ],
    [ 'blob', ENVS_MAP.dataAvailability, { pathname: '/blobs/[hash]', query: { hash: HASH } } ],
    [ 'ens_domain', ENVS_MAP.nameService, { pathname: '/name-services/domains/[name]', query: { name: HASH } } ],
  ] as const)('routes a %s redirect only when its feature is enabled', async(type, envs, expected) => {
    const withFeature = await withUtils(envs, ({ getRedirectRoute }) => getRedirectRoute({ redirect: true, type, parameter: HASH }));
    expect(withFeature).toEqual(expected);

    const withoutFeature = await withUtils(NO_FEATURES, ({ getRedirectRoute }) => getRedirectRoute({ redirect: true, type, parameter: HASH }));
    expect(withoutFeature).toBeUndefined();
  });
});

describe('isDisplayableResultItem', () => {
  it.each([
    searchMock.token1,
    searchMock.address1,
    searchMock.contract1,
    searchMock.block1,
    searchMock.label1,
    searchMock.tx1,
  ])('shows a $type item on any chain', async(item) => {
    expect(await withUtils(NO_FEATURES, ({ isDisplayableResultItem }) => isDisplayableResultItem(item))).toBe(true);
  });

  it.each([
    [ userOp1, ENVS_MAP.userOps ],
    [ blob1, ENVS_MAP.dataAvailability ],
    [ domain1, ENVS_MAP.nameService ],
    [ tacOperation1, ENVS_MAP.tac ],
  ])('shows a $0.type item only when its feature is enabled', async(item, envs) => {
    expect(await withUtils(envs, ({ isDisplayableResultItem }) => isDisplayableResultItem(item))).toBe(true);
    expect(await withUtils(NO_FEATURES, ({ isDisplayableResultItem }) => isDisplayableResultItem(item))).toBe(false);
  });

  it('hides a type the results table does not render', async() => {
    const cctx = { type: 'zetaChainCCTX', cctx: zetaChainCCTXItem } satisfies SearchResultItem;
    expect(await withUtils(NO_FEATURES, ({ isDisplayableResultItem }) => isDisplayableResultItem(cctx))).toBe(false);
  });
});

describe('buildFutureBlockItem', () => {
  const base = {
    searchTerm: '1234567890',
    items: [ searchMock.token1 ],
    isFirstPage: true,
    isLastPage: true,
    isLoading: false,
  };

  it('adds a countdown block when a numeric query found no block on a single page of results', async() => {
    const item = await withUtils(NO_FEATURES, ({ buildFutureBlockItem }) => buildFutureBlockItem(base));
    expect(item).toEqual({
      type: 'block',
      block_type: 'block',
      block_number: '1234567890',
      block_hash: '',
      timestamp: undefined,
    });
  });

  it.each([
    [ 'the query is not a block height', { searchTerm: '0xabc' } ],
    [ 'the results include a block', { items: [ searchMock.block1 ] } ],
    [ 'there are no results', { items: [] } ],
    [ 'the results are still loading', { isLoading: true } ],
    [ 'it is not the first page', { isFirstPage: false } ],
    [ 'there are more pages', { isLastPage: false } ],
  ])('adds nothing when %s', async(_, overrides) => {
    const item = await withUtils(NO_FEATURES, ({ buildFutureBlockItem }) => buildFutureBlockItem({ ...base, ...overrides }));
    expect(item).toBeUndefined();
  });
});
