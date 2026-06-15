// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { merged } from '@blockscout/api-types';
import type { TransactionsResponseWatchlist } from 'src/features/account/types/api';
import type { TransactionsResponseWithBlobs, TxsWithBlobsFilters, TxBlobs } from 'src/features/data-availability/types/api';
import type { FheOperationsResponse } from 'src/features/fhe-operations/types/api';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';
import type { InternalTransactionFilters, InternalTransactionsResponse } from 'src/slices/internal-tx/types/api';
import type { LogsResponseTx } from 'src/slices/log/types/api';
import type { TokenTransferResponse, TokenTransferFilters } from 'src/slices/token-transfer/types/api';
import type {
  TransactionsResponseValidated,
  TransactionsResponsePending,
  Transaction,
  TransactionsStats,
  TxsFilters,
  TxRawTracesResponse,
} from 'src/slices/tx/types/api';

export const CORE_API_TX_RESOURCES = {
  txs_stats: {
    path: '/api/v2/transactions/stats',
  },
  txs_validated: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
    paginated: true,
  },
  txs_pending: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
    paginated: true,
  },
  txs_with_blobs: {
    path: '/api/v2/transactions',
    filterFields: [ 'type' as const ],
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
    paginated: true,
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
R extends 'core:txs_stats' ? TransactionsStats :
R extends 'core:txs_validated' ? TransactionsResponseValidated :
R extends 'core:txs_pending' ? TransactionsResponsePending :
R extends 'core:txs_with_blobs' ? TransactionsResponseWithBlobs :
R extends 'core:txs_watchlist' ? TransactionsResponseWatchlist :
R extends 'core:txs_execution_node' ? TransactionsResponseValidated :
R extends 'core:tx_internal_txs' ? InternalTransactionsResponse :
R extends 'core:tx' ? Transaction :
R extends 'core:tx_logs' ? LogsResponseTx :
R extends 'core:tx_token_transfers' ? TokenTransferResponse :
R extends 'core:tx_fhe_operations' ? FheOperationsResponse :
R extends 'core:tx_raw_trace' ? TxRawTracesResponse :
R extends 'core:tx_state_changes' ?
  merged.paths['/v2/transactions/{transaction_hash_param}/state-changes']['get']['responses']['200']['content']['application/json'] :
R extends 'core:tx_blobs' ? TxBlobs :
R extends 'core:tx_interpretation' ? TxInterpretationResponse :
R extends 'core:tx_external_transactions' ? Array<string> :
R extends 'core:internal_txs' ? InternalTransactionsResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiTxPaginationFilters<R extends CoreApiTxResourceName> =
R extends 'core:txs_validated' | 'core:txs_pending' ? TxsFilters :
R extends 'core:txs_with_blobs' ? TxsWithBlobsFilters :
R extends 'core:tx_token_transfers' ? TokenTransferFilters :
R extends 'core:internal_txs' ? InternalTransactionFilters :
never;
/* eslint-enable @stylistic/indent */
