import type { ApiResource } from '../types';
import type * as interchainIndexer from '@blockscout/interchain-indexer-types';
import type {
  CrossChainFilters,
  CrossChainChainsStatsSorting,
  CrossChainBridgedTokensSorting,
} from 'client/features/cross-chain-txs/types/api';

export const INTERCHAIN_INDEXER_API_RESOURCES = {
  messages: {
    path: '/api/v1/interchain/messages',
    filterFields: [ 'q' as const ],
    paginated: true,
  },
  message: {
    path: '/api/v1/interchain/messages/:id',
    pathParams: [ 'id' as const ],
  },
  tx_messages: {
    path: '/api/v1/interchain/messages\\:byTx/:hash',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'q' as const ],
    paginated: true,
  },
  address_messages: {
    path: '/api/v1/interchain/messages\\:byAddress/:hash',
    pathParams: [ 'hash' as const ],
    paginated: true,
  },
  transfers: {
    path: '/api/v1/interchain/transfers',
    filterFields: [ 'q' as const ],
    paginated: true,
  },
  tx_transfers: {
    path: '/api/v1/interchain/transfers\\:byTx/:hash',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'q' as const ],
    paginated: true,
  },
  address_transfers: {
    path: '/api/v1/interchain/transfers\\:byAddress/:hash',
    pathParams: [ 'hash' as const ],
    paginated: true,
  },
  stats_daily: {
    path: '/api/v1/stats/daily',
  },
  stats_common: {
    path: '/api/v1/stats/common',
  },
  stats_chains: {
    path: '/api/v1/stats/chains',
    paginated: true,
  },
  bridged_tokens: {
    path: '/api/v1/stats/chain/:chainId/bridged-tokens',
    pathParams: [ 'chainId' as const ],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type InterchainIndexerApiResourceName = `interchainIndexer:${ keyof typeof INTERCHAIN_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type InterchainIndexerApiResourcePayload<R extends InterchainIndexerApiResourceName> =
R extends 'interchainIndexer:messages' ? interchainIndexer.GetMessagesResponse :
R extends 'interchainIndexer:message' ? interchainIndexer.InterchainMessage :
R extends 'interchainIndexer:tx_messages' ? interchainIndexer.GetMessagesResponse :
R extends 'interchainIndexer:address_messages' ? interchainIndexer.GetMessagesResponse :
R extends 'interchainIndexer:transfers' ? interchainIndexer.GetTransfersResponse :
R extends 'interchainIndexer:tx_transfers' ? interchainIndexer.GetTransfersResponse :
R extends 'interchainIndexer:address_transfers' ? interchainIndexer.GetTransfersResponse :
R extends 'interchainIndexer:stats_daily' ? interchainIndexer.GetDailyStatisticsResponse :
R extends 'interchainIndexer:stats_common' ? interchainIndexer.GetCommonStatisticsResponse :
R extends 'interchainIndexer:stats_chains' ? interchainIndexer.GetChainsStatsResponse :
R extends 'interchainIndexer:bridged_tokens' ? interchainIndexer.GetBridgedTokensResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type InterchainIndexerApiPaginationFilters<R extends InterchainIndexerApiResourceName> =
R extends 'interchainIndexer:messages' ? CrossChainFilters :
R extends 'interchainIndexer:transfers' ? CrossChainFilters :
R extends 'interchainIndexer:stats_chains' ? CrossChainFilters :
R extends 'interchainIndexer:bridged_tokens' ? CrossChainFilters :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type InterchainIndexerApiPaginationSorting<R extends InterchainIndexerApiResourceName> =
R extends 'interchainIndexer:stats_chains' ? CrossChainChainsStatsSorting :
R extends 'interchainIndexer:bridged_tokens' ? CrossChainBridgedTokensSorting :
never;
/* eslint-enable @stylistic/indent */
