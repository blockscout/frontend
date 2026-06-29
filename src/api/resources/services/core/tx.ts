// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { paths } from '@blockscout/api-types';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';
import type { InternalTransactionFilters } from 'src/slices/internal-tx/types/api';
import type { TokenTransferFilters } from 'src/slices/token-transfer/types/api';
import type { TxsFilters } from 'src/slices/tx/types/api';

export const CORE_API_TX_RESOURCES = {
  txs_stats: {
    path: '/api/v2/transactions/stats',
  },
  txs: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const ],
    paginated: true,
  },
  txs_watchlist: {
    path: '/api/v2/transactions/watchlist',
    filterFields: [ ],
    paginated: true,
  },
  txs_execution_node: {
    path: '/api/v2/transactions/execution-node/:hash',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  tx: {
    path: '/api/v2/transactions/:hash',
    pathParams: [ 'hash' as const ],
  },
  tx_internal_txs: {
    path: '/api/v2/transactions/:hash/internal-transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  tx_logs: {
    path: '/api/v2/transactions/:hash/logs',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  tx_fhe_operations: {
    path: '/api/v2/transactions/:hash/fhe-operations',
    pathParams: [ 'hash' as const ],
  },

  tx_token_transfers: {
    path: '/api/v2/transactions/:hash/token-transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  tx_raw_trace: {
    path: '/api/v2/transactions/:hash/raw-trace',
    pathParams: [ 'hash' as const ],
  },
  tx_state_changes: {
    path: '/api/v2/transactions/:hash/state-changes',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  tx_blobs: {
    path: '/api/v2/transactions/:hash/blobs',
    pathParams: [ 'hash' as const ],
  },
  tx_interpretation: {
    path: '/api/v2/transactions/:hash/summary',
    pathParams: [ 'hash' as const ],
  },
  tx_external_transactions: {
    path: '/api/v2/transactions/:hash/external-transactions',
    pathParams: [ 'hash' as const ],
  },
  internal_txs: {
    path: '/api/v2/internal-transactions',
    paginated: true,
    filterFields: [ 'transaction_hash' as const ],
  },
} satisfies Record<string, ApiResource>;

export type CoreApiTxResourceName = `core:${ keyof typeof CORE_API_TX_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiTxResourcePayload<R extends CoreApiTxResourceName> =
R extends 'core:txs' ? paths['/api/v2/transactions']['get'] :
R extends 'core:txs_stats' ? paths['/api/v2/transactions/stats']['get'] :
R extends 'core:txs_watchlist' ? paths['/api/v2/transactions/watchlist']['get'] :
R extends 'core:txs_execution_node' ? paths['/api/v2/transactions/execution-node/{execution_node_hash_param}']['get'] :
R extends 'core:tx' ? paths['/api/v2/transactions/{transaction_hash_param}']['get'] :
R extends 'core:tx_logs' ? paths['/api/v2/transactions/{transaction_hash_param}/logs']['get'] :
R extends 'core:tx_token_transfers' ? paths['/api/v2/transactions/{transaction_hash_param}/token-transfers']['get'] :
R extends 'core:tx_internal_txs' ? paths['/api/v2/transactions/{transaction_hash_param}/internal-transactions']['get'] :
R extends 'core:tx_fhe_operations' ? paths['/api/v2/transactions/{transaction_hash_param}/fhe-operations']['get'] :
R extends 'core:tx_raw_trace' ? paths['/api/v2/transactions/{transaction_hash_param}/raw-trace']['get'] :
R extends 'core:tx_state_changes' ? paths['/api/v2/transactions/{transaction_hash_param}/state-changes']['get'] :
R extends 'core:tx_blobs' ? paths['/api/v2/transactions/{transaction_hash_param}/blobs']['get'] :
R extends 'core:tx_interpretation' ? TxInterpretationResponse :
R extends 'core:tx_external_transactions' ? paths['/api/v2/transactions/{transaction_hash_param}/external-transactions']['get'] :
R extends 'core:internal_txs' ? paths['/api/v2/internal-transactions']['get'] :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiTxPaginationFilters<R extends CoreApiTxResourceName> =
R extends 'core:txs' ? TxsFilters :
R extends 'core:tx_token_transfers' ? TokenTransferFilters :
R extends 'core:internal_txs' ? InternalTransactionFilters :
never;
/* eslint-enable @stylistic/indent */
