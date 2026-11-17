// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Bridge, ChainInfo } from '@blockscout/interchain-indexer-types';
import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';

import type { FilterTag } from 'src/shared/filters/FilterTagsRow';

const COLUMN_FILTER_FIELDS = [ 'src_chain_ids', 'dst_chain_ids', 'bridge_ids' ] as const;

export type CrossChainColumnFilterField = typeof COLUMN_FILTER_FIELDS[number];

export type CrossChainFilterChangeHandler = (filters: CrossChainFilters) => void;

export interface FilterDirectoriesPending {
  readonly chains: boolean;
  readonly bridges: boolean;
}

export interface ProtocolOption {
  readonly id: string;
  readonly name: string;
}

const EMPTY_CHAINS: Array<ChainInfo> = [];

const COLUMN_FILTER_NAMES: Record<CrossChainColumnFilterField, string> = {
  src_chain_ids: 'Source chain',
  dst_chain_ids: 'Destination chain',
  bridge_ids: 'Protocol',
};

export function splitFilterValue(value: string | undefined): Array<string> {
  return value ? value.split(',').filter(Boolean) : [];
}

export function joinFilterValue(values: Array<string>): string | undefined {
  return values.length > 0 ? values.join(',') : undefined;
}

export function hasActiveColumnFilters(filters: CrossChainFilters | undefined): boolean {
  return COLUMN_FILTER_FIELDS.some((field) => Boolean(filters?.[field]));
}

export function getProtocolOptions(bridges: Array<Bridge> | undefined, configuredBridgeIds: Array<number>): Array<ProtocolOption> {
  if (!bridges) {
    return [];
  }

  return bridges
    .filter((bridge) => bridge.enabled && configuredBridgeIds.includes(bridge.id))
    .map((bridge) => ({ id: String(bridge.id), name: bridge.name }));
}

export function filterChainOptions(chains: Array<ChainInfo> | undefined, searchTerm: string): Array<ChainInfo> {
  if (!chains) {
    return EMPTY_CHAINS;
  }

  const term = searchTerm.trim().toLowerCase();
  if (!term) {
    return chains;
  }

  return chains.filter((chain) => chain.name.toLowerCase().includes(term) || chain.id.toLowerCase().includes(term));
}

function getChainName(chainId: string, chains: Array<ChainInfo> | undefined): string {
  return chains?.find((chain) => chain.id === chainId)?.name || `Chain ${ chainId }`;
}

function getBridgeName(bridgeId: string, bridges: Array<Bridge> | undefined): string {
  return bridges?.find((bridge) => String(bridge.id) === bridgeId)?.name || `Bridge ${ bridgeId }`;
}

export function getCrossChainFilterTags(
  filters: CrossChainFilters | undefined,
  chains: Array<ChainInfo> | undefined,
  bridges: Array<Bridge> | undefined,
  pending: FilterDirectoriesPending = { chains: false, bridges: false },
): Array<FilterTag<CrossChainColumnFilterField>> {
  return COLUMN_FILTER_FIELDS.flatMap((field) => {
    const ids = splitFilterValue(filters?.[field]);

    if (ids.length === 0) {
      return [];
    }

    const isBridgeField = field === 'bridge_ids';
    const names = isBridgeField ?
      ids.map((id) => getBridgeName(id, bridges)) :
      ids.map((id) => getChainName(id, chains));
    const isLoading = isBridgeField ? pending.bridges : pending.chains;

    return [ { key: field, name: COLUMN_FILTER_NAMES[field], value: names.join(', '), isLoading } ];
  });
}
