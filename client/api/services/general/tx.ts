// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { TransactionsResponseWatchlist } from 'client/features/account/types/api';
import type { TransactionsResponseWithBlobs, TxsWithBlobsFilters, TxBlobs } from 'client/features/data-availability/types/api';
import type { InternalTransactionFilters, InternalTransactionsResponse } from 'client/slices/internal-tx/types/api';
import type { LogsResponseTx } from 'client/slices/log/types/api';
import type { TokenTransferResponse, TokenTransferFilters } from 'client/slices/token-transfer/types/api';
import type {
  TransactionsResponseValidated,
  TransactionsResponsePending,
  Transaction,
  TransactionsStats,
  TxsFilters,
  TxStateChanges,
  TxRawTracesResponse,
} from 'client/slices/tx/types/api';
import type { FheOperationsResponse } from 'types/api/fheOperations';
import type { TxInterpretationResponse } from 'types/api/txInterpretation';

export const GENERAL_API_TX_RESOURCES = {
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

export type GeneralApiTxResourceName = `general:${ keyof typeof GENERAL_API_TX_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GeneralApiTxResourcePayload<R extends GeneralApiTxResourceName> =
R extends 'general:txs_stats' ? TransactionsStats :
R extends 'general:txs_validated' ? TransactionsResponseValidated :
R extends 'general:txs_pending' ? TransactionsResponsePending :
R extends 'general:txs_with_blobs' ? TransactionsResponseWithBlobs :
R extends 'general:txs_watchlist' ? TransactionsResponseWatchlist :
R extends 'general:txs_execution_node' ? TransactionsResponseValidated :
R extends 'general:tx_internal_txs' ? InternalTransactionsResponse :
R extends 'general:tx' ? Transaction :
R extends 'general:tx_logs' ? LogsResponseTx :
R extends 'general:tx_token_transfers' ? TokenTransferResponse :
R extends 'general:tx_fhe_operations' ? FheOperationsResponse :
R extends 'general:tx_raw_trace' ? TxRawTracesResponse :
R extends 'general:tx_state_changes' ? TxStateChanges :
R extends 'general:tx_blobs' ? TxBlobs :
R extends 'general:tx_interpretation' ? TxInterpretationResponse :
R extends 'general:tx_external_transactions' ? Array<string> :
R extends 'general:internal_txs' ? InternalTransactionsResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type GeneralApiTxPaginationFilters<R extends GeneralApiTxResourceName> =
R extends 'general:txs_validated' | 'general:txs_pending' ? TxsFilters :
R extends 'general:txs_with_blobs' ? TxsWithBlobsFilters :
R extends 'general:tx_token_transfers' ? TokenTransferFilters :
R extends 'general:internal_txs' ? InternalTransactionFilters :
never;
/* eslint-enable @stylistic/indent */
