// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiName } from '../types';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import config from 'src/config';

const crossChainTxsFeature = config.features.crossChainTxs;

interface ScopeFilterContext {
  readonly declaredFilters: ReadonlyArray<string>;
  readonly chain?: ExternalChainExtended;
}

type ScopeFilterResolver = (context: ScopeFilterContext) => string | undefined;

const resolveFocalChainId: ScopeFilterResolver = ({ chain }) => {
  return config.features.multichain.isEnabled ? chain?.id : config.chain.id;
};

const resolveBridgeIds: ScopeFilterResolver = (context) => {
  if (crossChainTxsFeature.isEnabled) {
    const hasFocalChain = context.declaredFilters.includes('home_chain_id') && Boolean(resolveFocalChainId(context));

    if (hasFocalChain || crossChainTxsFeature.bridgeIds.length === 0) {
      return;
    }

    return crossChainTxsFeature.bridgeIds.join(',');
  }
};

const resolveIncludeUnindexedChains: ScopeFilterResolver = () => {
  if (crossChainTxsFeature.isEnabled) {
    return String(crossChainTxsFeature.includeUnindexedChains);
  }
};

const SCOPE_FILTER_RESOLVERS: Partial<Record<ApiName, Record<string, ScopeFilterResolver>>> = {
  interchainIndexer: {
    home_chain_id: resolveFocalChainId,
    bridge_ids: resolveBridgeIds,
    include_unindexed_chains: resolveIncludeUnindexedChains,
  },
};

const NO_SCOPE_FILTERS: ReadonlyArray<string> = [];
const NO_RESOLVERS: Record<string, ScopeFilterResolver> = {};

export function resolveScopeFilters(
  apiName: ApiName,
  scopeFilters: ReadonlyArray<string> | undefined,
  chain?: ExternalChainExtended,
): Record<string, string> {
  const resolvers = SCOPE_FILTER_RESOLVERS[apiName] ?? NO_RESOLVERS;
  const declaredFilters = scopeFilters ?? NO_SCOPE_FILTERS;
  const context: ScopeFilterContext = { declaredFilters, chain };

  const entries = declaredFilters
    .map((name) => [ name, resolvers[name]?.(context) ] as const)
    .filter((entry): entry is [ string, string ] => entry[1] !== undefined);

  return Object.fromEntries(entries);
}
