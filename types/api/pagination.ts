import type { BlocksResponse, BlockTransactionsResponse, BlockFilters } from 'types/api/block';
import type { InternalTransactionsResponse } from 'types/api/internalTransaction';
import type { LogsResponse } from 'types/api/log';
import type { TokenTransferResponse, TokenTransferFilters } from 'types/api/tokenTransfer';
import type { TransactionsResponseValidated, TransactionsResponsePending } from 'types/api/transaction';
import type { TTxsFilters } from 'types/api/txsFilters';
import { QueryKeys } from 'types/client/queries';
import type { KeysOfObjectOrNull } from 'types/utils/KeysOfObjectOrNull';

export type PaginatedQueryKeys =
  QueryKeys.blocks |
  QueryKeys.blockTxs |
  QueryKeys.txsValidate |
  QueryKeys.txsPending |
  QueryKeys.txInternals |
  QueryKeys.txLogs |
  QueryKeys.txTokenTransfers;

export type PaginatedResponse<Q extends PaginatedQueryKeys> =
  Q extends QueryKeys.blocks ? BlocksResponse :
    Q extends QueryKeys.blockTxs ? BlockTransactionsResponse :
      Q extends QueryKeys.txsValidate ? TransactionsResponseValidated :
        Q extends QueryKeys.txsPending ? TransactionsResponsePending :
          Q extends QueryKeys.txInternals ? InternalTransactionsResponse :
            Q extends QueryKeys.txLogs ? LogsResponse :
              Q extends QueryKeys.txTokenTransfers ? TokenTransferResponse :
                never

export type PaginationFilters<Q extends PaginatedQueryKeys> =
  Q extends QueryKeys.blocks ? BlockFilters :
    Q extends QueryKeys.txsValidate ? TTxsFilters :
      Q extends QueryKeys.txsPending ? TTxsFilters :
        Q extends QueryKeys.txTokenTransfers ? TokenTransferFilters :
          never

export type PaginationParams<Q extends PaginatedQueryKeys> = PaginatedResponse<Q>['next_page_params'];

type PaginationFields = {
  [K in PaginatedQueryKeys]: Array<KeysOfObjectOrNull<PaginatedResponse<K>['next_page_params']>>
}

export const PAGINATION_FIELDS: PaginationFields = {
  [QueryKeys.blocks]: [ 'block_number', 'items_count' ],
  [QueryKeys.blockTxs]: [ 'block_number', 'items_count' ],
  [QueryKeys.txsValidate]: [ 'block_number', 'items_count', 'filter', 'index' ],
  [QueryKeys.txsPending]: [ 'filter', 'hash', 'inserted_at' ],
  [QueryKeys.txInternals]: [ 'block_number', 'items_count', 'transaction_hash', 'index', 'transaction_index' ],
  [QueryKeys.txTokenTransfers]: [ 'block_number', 'items_count', 'transaction_hash', 'index' ],
  [QueryKeys.txLogs]: [ 'items_count', 'transaction_hash', 'index' ],
};
