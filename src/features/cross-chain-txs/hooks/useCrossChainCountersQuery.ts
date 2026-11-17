// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as stats from '@blockscout/stats-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';

import { CROSS_CHAIN_COUNTERS } from '../stubs/counters';

export type CrossChainCounterId =
  'totalInterchainMessages' |
  'totalInterchainTransfers' |
  'newMessagesInterchain24h' |
  'newTransfersInterchain24h';

export type CrossChainCounters = Partial<Record<CrossChainCounterId, string>>;

type ResourceName = 'stats:counters' | 'multichainStats:counters';

const RESOURCE_NAME: ResourceName = config.features.multichain.isEnabled ? 'multichainStats:counters' : 'stats:counters';
const IS_ENABLED = config.features.multichain.isEnabled ? Boolean(config.apis.multichainStats) : Boolean(config.apis.stats);

function selectCrossChainCounters(data: stats.Counters): CrossChainCounters {
  return Object.fromEntries(data.counters.map((counter) => [ counter.id, counter.value ]));
}

export function useCrossChainCountersQuery() {
  return useApiQuery<ResourceName, unknown, CrossChainCounters>(RESOURCE_NAME, {
    queryOptions: {
      enabled: IS_ENABLED,
      placeholderData: IS_ENABLED ? CROSS_CHAIN_COUNTERS : undefined,
      refetchOnMount: false,
      select: selectCrossChainCounters,
    },
  });
}
