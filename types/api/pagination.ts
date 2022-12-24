import type {
  AddressTransactionsResponse,
  AddressTokenTransferResponse,
  AddressTxsFilters,
  AddressTokenTransferFilters,
  AddressCoinBalanceHistoryResponse,
  AddressBlocksValidatedResponse,
  AddressInternalTxsResponse,
} from 'types/api/address';
import type { BlocksResponse, BlockTransactionsResponse, BlockFilters } from 'types/api/block';
import type { InternalTransactionsResponse } from 'types/api/internalTransaction';
import type { LogsResponse } from 'types/api/log';
import type { TokenTransferResponse, TokenTransferFilters } from 'types/api/tokenTransfer';
import type { TransactionsResponseValidated, TransactionsResponsePending } from 'types/api/transaction';
import type { TTxsFilters } from 'types/api/txsFilters';
import { QueryKeys } from 'types/client/queries';
import type { KeysOfObjectOrNull } from 'types/utils/KeysOfObjectOrNull';

export type PaginatedQueryKeys =
  QueryKeys.addressTxs |
  QueryKeys.addressTokenTransfers |
  QueryKeys.addressInternalTxs |
  QueryKeys.blocks |
  QueryKeys.blocksReorgs |
  QueryKeys.blocksUncles |
  QueryKeys.blockTxs |
  QueryKeys.txsValidate |
  QueryKeys.txsPending |
  QueryKeys.txInternals |
  QueryKeys.txLogs |
  QueryKeys.txTokenTransfers |
  QueryKeys.addressCoinBalanceHistory |
  QueryKeys.addressBlocksValidated;

export type PaginatedResources = 'blocks' | 'block_txs';

export type PaginatedResponseX<Q extends PaginatedResources> =
  Q extends 'blocks' ? BlocksResponse :
    Q extends 'block_txs' ? BlockTransactionsResponse :
      never;

export type PaginationFiltersX<Q extends PaginatedResources> =
  Q extends 'blocks' ? BlockFilters :
    never;

export type PaginatedResponse<Q extends PaginatedQueryKeys> =
Q extends QueryKeys.addressInternalTxs ? AddressInternalTxsResponse :
  Q extends QueryKeys.addressTxs ? AddressTransactionsResponse :
    Q extends QueryKeys.addressTokenTransfers ? AddressTokenTransferResponse :
      Q extends (QueryKeys.blocks | QueryKeys.blocksReorgs | QueryKeys.blocksUncles) ? BlocksResponse :
        Q extends QueryKeys.blockTxs ? BlockTransactionsResponse :
          Q extends QueryKeys.txsValidate ? TransactionsResponseValidated :
            Q extends QueryKeys.txsPending ? TransactionsResponsePending :
              Q extends QueryKeys.txInternals ? InternalTransactionsResponse :
                Q extends QueryKeys.txLogs ? LogsResponse :
                  Q extends QueryKeys.txTokenTransfers ? TokenTransferResponse :
                    Q extends QueryKeys.addressCoinBalanceHistory ? AddressCoinBalanceHistoryResponse :
                      Q extends QueryKeys.addressBlocksValidated ? AddressBlocksValidatedResponse :
                        never

export type PaginationFilters<Q extends PaginatedQueryKeys> =
  Q extends (QueryKeys.addressTxs | QueryKeys.addressInternalTxs) ? AddressTxsFilters :
    Q extends QueryKeys.addressTokenTransfers ? AddressTokenTransferFilters :
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
  [QueryKeys.addressTxs]: [ 'block_number', 'items_count', 'index' ],
  [QueryKeys.addressInternalTxs]: [ 'block_number', 'items_count', 'index', 'transaction_index' ],
  [QueryKeys.addressTokenTransfers]: [ 'block_number', 'items_count', 'index', 'transaction_hash' ],
  [QueryKeys.blocks]: [ 'block_number', 'items_count' ],
  [QueryKeys.blocksReorgs]: [ 'block_number', 'items_count' ],
  [QueryKeys.blocksUncles]: [ 'block_number', 'items_count' ],
  [QueryKeys.blockTxs]: [ 'block_number', 'items_count', 'index' ],
  [QueryKeys.txsValidate]: [ 'block_number', 'items_count', 'filter', 'index' ],
  [QueryKeys.txsPending]: [ 'filter', 'hash', 'inserted_at' ],
  [QueryKeys.txInternals]: [ 'block_number', 'items_count', 'transaction_hash', 'index', 'transaction_index' ],
  [QueryKeys.txTokenTransfers]: [ 'block_number', 'items_count', 'transaction_hash', 'index' ],
  [QueryKeys.txLogs]: [ 'items_count', 'transaction_hash', 'index' ],
  [QueryKeys.addressCoinBalanceHistory]: [ 'items_count', 'block_number' ],
  [QueryKeys.addressBlocksValidated]: [ 'items_count', 'block_number' ],
};

type PaginationFiltersFields = {
  [K in PaginatedQueryKeys]: Array<KeysOfObjectOrNull<PaginationFilters<K>>>
}

export const PAGINATION_FILTERS_FIELDS: PaginationFiltersFields = {
  [QueryKeys.addressTxs]: [ 'filter' ],
  [QueryKeys.addressInternalTxs]: [ 'filter' ],
  [QueryKeys.addressTokenTransfers]: [ 'filter', 'type' ],
  [QueryKeys.addressCoinBalanceHistory]: [],
  [QueryKeys.addressBlocksValidated]: [],
  [QueryKeys.blocks]: [ 'type' ],
  [QueryKeys.txsValidate]: [ 'filter', 'type', 'method' ],
  [QueryKeys.txsPending]: [ 'filter', 'type', 'method' ],
  [QueryKeys.txTokenTransfers]: [ 'type' ],
  [QueryKeys.blocksReorgs]: [],
  [QueryKeys.blocksUncles]: [],
  [QueryKeys.blockTxs]: [],
  [QueryKeys.txInternals]: [],
  [QueryKeys.txLogs]: [],
};
