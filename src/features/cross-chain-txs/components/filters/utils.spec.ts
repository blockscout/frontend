// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { bridgeAmb, bridgeAvalanche, bridgeXdai } from '../../mocks/bridges';
import { config as chains } from '../../mocks/config';
import { filterChainOptions, getCrossChainFilterTags, getProtocolOptions, hasActiveColumnFilters, joinFilterValue, splitFilterValue } from './utils';

const BRIDGES = [ bridgeAmb, bridgeAvalanche, bridgeXdai ];

describe('getProtocolOptions', () => {
  it('lists only bridges that are enabled and configured for the deployment', () => {
    const disabledBridge = { ...bridgeXdai, enabled: false };

    expect(getProtocolOptions([ bridgeAmb, bridgeAvalanche, disabledBridge ], [ 1, 3, 99 ])).toEqual([
      { id: '1', name: 'AMB/Omnibridge' },
    ]);
  });

  it('keeps a single configured bridge', () => {
    expect(getProtocolOptions(BRIDGES, [ 2 ])).toEqual([ { id: '2', name: 'Avalanche ICTT' } ]);
  });

  it('returns no options before the bridges are loaded', () => {
    expect(getProtocolOptions(undefined, [ 1, 2 ])).toEqual([]);
  });
});

describe('splitFilterValue / joinFilterValue', () => {
  it('round-trips a comma-joined URL value', () => {
    expect(splitFilterValue('1,100')).toEqual([ '1', '100' ]);
    expect(joinFilterValue([ '1', '100' ])).toBe('1,100');
  });

  it('treats an absent or empty value as no selection', () => {
    expect(splitFilterValue(undefined)).toEqual([]);
    expect(splitFilterValue('')).toEqual([]);
    expect(joinFilterValue([])).toBeUndefined();
  });
});

describe('filterChainOptions', () => {
  it('returns every chain when the search term is blank', () => {
    expect(filterChainOptions(chains, '')).toBe(chains);
    expect(filterChainOptions(chains, '   ')).toBe(chains);
  });

  it('matches by chain name or chain id, case-insensitively', () => {
    expect(filterChainOptions(chains, 'c-CHAIN').map((chain) => chain.id)).toEqual([ '43114' ]);
    expect(filterChainOptions(chains, '4311').map((chain) => chain.id)).toEqual([ '43114' ]);
    expect(filterChainOptions(chains, 'no such chain')).toEqual([]);
  });

  it('returns no chains before the list is loaded', () => {
    expect(filterChainOptions(undefined, 'c')).toEqual([]);
  });
});

describe('hasActiveColumnFilters', () => {
  it('ignores the search term', () => {
    expect(hasActiveColumnFilters({ q: 'foo' })).toBe(false);
    expect(hasActiveColumnFilters({ q: 'foo', bridge_ids: '1' })).toBe(true);
    expect(hasActiveColumnFilters(undefined)).toBe(false);
  });
});

describe('getCrossChainFilterTags', () => {
  it('returns no tags when no column filter is set', () => {
    expect(getCrossChainFilterTags({ q: 'foo' }, chains, BRIDGES)).toEqual([]);
  });

  it('maps URL ids to chain and bridge names, joined with a comma', () => {
    const tags = getCrossChainFilterTags(
      { src_chain_ids: '43114,8021', dst_chain_ids: '4444', bridge_ids: '1,3' },
      chains,
      BRIDGES,
    );

    expect(tags).toEqual([
      { key: 'src_chain_ids', name: 'Source chain', value: 'C-Chain, Numine', isLoading: false },
      { key: 'dst_chain_ids', name: 'Destination chain', value: 'Duck chain', isLoading: false },
      { key: 'bridge_ids', name: 'Protocol', value: 'AMB/Omnibridge, xDai Bridge', isLoading: false },
    ]);
  });

  it('falls back to the id when a chain or bridge is unknown', () => {
    const tags = getCrossChainFilterTags({ src_chain_ids: '7', bridge_ids: '42' }, undefined, undefined);

    expect(tags).toEqual([
      { key: 'src_chain_ids', name: 'Source chain', value: 'Chain 7', isLoading: false },
      { key: 'bridge_ids', name: 'Protocol', value: 'Bridge 42', isLoading: false },
    ]);
  });

  it('marks only the tags whose directory is still pending as loading', () => {
    const tags = getCrossChainFilterTags(
      { src_chain_ids: '7', dst_chain_ids: '4444', bridge_ids: '1' },
      undefined,
      BRIDGES,
      { chains: true, bridges: false },
    );

    expect(tags.map((tag) => [ tag.key, tag.isLoading ])).toEqual([
      [ 'src_chain_ids', true ],
      [ 'dst_chain_ids', true ],
      [ 'bridge_ids', false ],
    ]);
  });
});
