import type { UserInfo, CustomAbis, PublicTags, AddressTags, TransactionTags, ApiKeys, WatchlistAddress } from 'types/api/account';
import type {
  Address,
  AddressCounters,
  AddressTransactionsResponse,
  AddressTokenTransferResponse,
  AddressCoinBalanceHistoryResponse,
  AddressCoinBalanceHistoryChart,
  AddressBlocksValidatedResponse,
  AddressInternalTxsResponse,
  AddressTxsFilters,
  AddressTokenTransferFilters,
  AddressTokensFilter,
  AddressTokensResponse,
} from 'types/api/address';
import type { AddressesResponse } from 'types/api/addresses';
import type { BlocksResponse, BlockTransactionsResponse, Block, BlockFilters } from 'types/api/block';
import type { ChartMarketResponse, ChartTransactionResponse } from 'types/api/charts';
import type { SmartContract, SmartContractReadMethod, SmartContractWriteMethod, SmartContractVerificationConfig } from 'types/api/contract';
import type { IndexingStatus } from 'types/api/indexingStatus';
import type { InternalTransactionsResponse } from 'types/api/internalTransaction';
import type { LogsResponseTx, LogsResponseAddress } from 'types/api/log';
import type { RawTracesResponse } from 'types/api/rawTrace';
import type { SearchResult, SearchResultFilters } from 'types/api/search';
import type { Counters, StatsCharts, StatsChart, HomeStats } from 'types/api/stats';
import type { TokenCounters, TokenInfo, TokenHolders, TokenInventoryResponse, TokenInstance, TokenInstanceTransfersCount } from 'types/api/token';
import type { TokensResponse, TokensFilters } from 'types/api/tokens';
import type { TokenTransferResponse, TokenTransferFilters } from 'types/api/tokenTransfer';
import type { TransactionsResponseValidated, TransactionsResponsePending, Transaction } from 'types/api/transaction';
import type { TTxsFilters } from 'types/api/txsFilters';
import type { VisualizedContract } from 'types/api/visualization';
import type ArrayElement from 'types/utils/ArrayElement';

import appConfig from 'configs/app/config';

export interface ApiResource {
  path: string;
  endpoint?: string;
  basePath?: string;
}

export const RESOURCES = {
  // ACCOUNT
  csrf: {
    path: '/api/account/v1/get_csrf',
  },
  user_info: {
    path: '/api/account/v1/user/info',
  },
  custom_abi: {
    path: '/api/account/v1/user/custom_abis/:id?',
  },
  watchlist: {
    path: '/api/account/v1/user/watchlist/:id?',
  },
  public_tags: {
    path: '/api/account/v1/user/public_tags/:id?',
  },
  private_tags_address: {
    path: '/api/account/v1/user/tags/address/:id?',
  },
  private_tags_tx: {
    path: '/api/account/v1/user/tags/transaction/:id?',
  },
  api_keys: {
    path: '/api/account/v1/user/api_keys/:id?',
  },

  // STATS
  stats_counters: {
    path: '/api/v1/counters',
    endpoint: appConfig.statsApi.endpoint,
    basePath: appConfig.statsApi.basePath,
  },
  stats_lines: {
    path: '/api/v1/lines',
    endpoint: appConfig.statsApi.endpoint,
    basePath: appConfig.statsApi.basePath,
  },
  stats_line: {
    path: '/api/v1/lines/:id',
    endpoint: appConfig.statsApi.endpoint,
    basePath: appConfig.statsApi.basePath,
  },

  // VISUALIZATION
  visualize_sol2uml: {
    path: '/api/v1/solidity\\:visualize-contracts',
    endpoint: appConfig.visualizeApi.endpoint,
    basePath: appConfig.visualizeApi.basePath,
  },

  // BLOCKS, TXS
  blocks: {
    path: '/api/v2/blocks',
    paginationFields: [ 'block_number' as const, 'items_count' as const ],
    filterFields: [ 'type' as const ],
  },
  block: {
    path: '/api/v2/blocks/:id',
  },
  block_txs: {
    path: '/api/v2/blocks/:id/transactions',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'index' as const ],
    filterFields: [],
  },
  txs_validated: {
    path: '/api/v2/transactions',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'filter' as const, 'index' as const ],
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  txs_pending: {
    path: '/api/v2/transactions',
    paginationFields: [ 'filter' as const, 'hash' as const, 'inserted_at' as const ],
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  tx: {
    path: '/api/v2/transactions/:id',
  },
  tx_internal_txs: {
    path: '/api/v2/transactions/:id/internal-transactions',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'transaction_hash' as const, 'index' as const, 'transaction_index' as const ],
    filterFields: [ ],
  },
  tx_logs: {
    path: '/api/v2/transactions/:id/logs',
    paginationFields: [ 'items_count' as const, 'transaction_hash' as const, 'index' as const ],
    filterFields: [ ],
  },
  tx_token_transfers: {
    path: '/api/v2/transactions/:id/token-transfers',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'transaction_hash' as const, 'index' as const ],
    filterFields: [ 'type' as const ],
  },
  tx_raw_trace: {
    path: '/api/v2/transactions/:id/raw-trace',
  },

  // ADDRESSES
  addresses: {
    path: '/api/v2/addresses/',
    paginationFields: [ 'fetched_coin_balance' as const, 'hash' as const, 'items_count' as const ],
    filterFields: [ ],
  },

  // ADDRESS
  address: {
    path: '/api/v2/addresses/:id',
  },
  address_counters: {
    path: '/api/v2/addresses/:id/counters',
  },
  // this resource doesn't have pagination, so causing huge problems on some addresses page
  // address_token_balances: {
  //   path: '/api/v2/addresses/:id/token-balances',
  // },
  address_txs: {
    path: '/api/v2/addresses/:id/transactions',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'index' as const ],
    filterFields: [ 'filter' as const ],
  },
  address_internal_txs: {
    path: '/api/v2/addresses/:id/internal-transactions',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'index' as const, 'transaction_index' as const ],
    filterFields: [ 'filter' as const ],
  },
  address_token_transfers: {
    path: '/api/v2/addresses/:id/token-transfers',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'index' as const, 'transaction_index' as const ],
    filterFields: [ 'filter' as const, 'type' as const, 'token' as const ],
  },
  address_blocks_validated: {
    path: '/api/v2/addresses/:id/blocks-validated',
    paginationFields: [ 'items_count' as const, 'block_number' as const ],
    filterFields: [ ],
  },
  address_coin_balance: {
    path: '/api/v2/addresses/:id/coin-balance-history',
    paginationFields: [ 'items_count' as const, 'block_number' as const ],
    filterFields: [ ],
  },
  address_coin_balance_chart: {
    path: '/api/v2/addresses/:id/coin-balance-history-by-day',
  },
  address_logs: {
    path: '/api/v2/addresses/:id/logs',
    paginationFields: [ 'items_count' as const, 'transaction_index' as const, 'index' as const, 'block_number' as const ],
    filterFields: [ ],
  },
  address_tokens: {
    path: '/api/v2/addresses/:id/tokens',
    paginationFields: [ 'items_count' as const, 'token_name' as const, 'token_type' as const, 'value' as const ],
    filterFields: [ 'type' as const ],
  },

  // CONTRACT
  contract: {
    path: '/api/v2/smart-contracts/:id',
  },
  contract_methods_read: {
    path: '/api/v2/smart-contracts/:id/methods-read',
  },
  contract_methods_read_proxy: {
    path: '/api/v2/smart-contracts/:id/methods-read-proxy',
  },
  contract_method_query: {
    path: '/api/v2/smart-contracts/:id/query-read-method',
  },
  contract_methods_write: {
    path: '/api/v2/smart-contracts/:id/methods-write',
  },
  contract_methods_write_proxy: {
    path: '/api/v2/smart-contracts/:id/methods-write-proxy',
  },
  contract_verification_config: {
    path: '/api/v2/smart-contracts/verification/config',
  },
  contract_verification_via: {
    path: '/api/v2/smart-contracts/:id/verification/via/:method',
  },

  // TOKEN
  token: {
    path: '/api/v2/tokens/:hash',
  },
  token_counters: {
    path: '/api/v2/tokens/:hash/counters',
  },
  token_holders: {
    path: '/api/v2/tokens/:hash/holders',
    paginationFields: [ 'items_count' as const, 'value' as const ],
    filterFields: [],
  },
  token_transfers: {
    path: '/api/v2/tokens/:hash/transfers',
    paginationFields: [ 'block_number' as const, 'items_count' as const, 'index' as const ],
    filterFields: [],
  },
  token_inventory: {
    path: '/api/v2/tokens/:hash/instances',
    paginationFields: [ 'unique_token' as const ],
    filterFields: [],
  },
  tokens: {
    path: '/api/v2/tokens',
    paginationFields: [ 'holder_count' as const, 'items_count' as const, 'name' as const ],
    filterFields: [ 'filter' as const, 'type' as const ],
  },

  // TOKEN INSTANCE
  token_instance: {
    path: '/api/v2/tokens/:hash/instances/:id',
  },
  token_instance_transfers_count: {
    path: '/api/v2/tokens/:hash/instances/:id/transfers-count',
  },

  // HOMEPAGE
  homepage_stats: {
    path: '/api/v2/stats',
  },
  homepage_chart_txs: {
    path: '/api/v2/stats/charts/transactions',
  },
  homepage_chart_market: {
    path: '/api/v2/stats/charts/market',
  },
  homepage_blocks: {
    path: '/api/v2/main-page/blocks',
  },
  homepage_txs: {
    path: '/api/v2/main-page/transactions',
  },
  homepage_indexing_status: {
    path: '/api/v2/main-page/indexing-status',
  },

  // SEARCH
  search: {
    path: '/api/v2/search',
    paginationFields: [
      'address_hash' as const,
      'block_hash' as const,
      'holder_count' as const,
      'inserted_at' as const,
      'item_type' as const,
      'items_count' as const,
      'name' as const,
      'q' as const,
      'tx_hash' as const,
    ],
    filterFields: [ 'q' ],
  },
  search_check_redirect: {
    path: '/api/v2/search/check-redirect',
  },

  // DEPRECATED
  old_api: {
    path: '/api',
  },
};

export type ResourceName = keyof typeof RESOURCES;

export type ResourceFiltersKey<R extends ResourceName> = typeof RESOURCES[R] extends {filterFields: Array<unknown>} ?
  ArrayElement<typeof RESOURCES[R]['filterFields']> :
  never;

export type ResourcePaginationKey<R extends ResourceName> = typeof RESOURCES[R] extends {paginationFields: Array<unknown>} ?
  ArrayElement<typeof RESOURCES[R]['paginationFields']> :
  never;

export const resourceKey = (x: keyof typeof RESOURCES) => x;

export interface ResourceError<T = unknown> {
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

export type ResourceErrorAccount<T> = ResourceError<{ errors: T }>

export type PaginatedResources = 'blocks' | 'block_txs' |
'txs_validated' | 'txs_pending' |
'tx_internal_txs' | 'tx_logs' | 'tx_token_transfers' |
'addresses' |
'address_txs' | 'address_internal_txs' | 'address_token_transfers' | 'address_blocks_validated' | 'address_coin_balance' |
'search' |
'address_logs' | 'address_tokens' |
'token_transfers' | 'token_holders' | 'token_inventory' | 'tokens';

export type PaginatedResponse<Q extends PaginatedResources> = ResourcePayload<Q>;

/* eslint-disable @typescript-eslint/indent */
export type ResourcePayload<Q extends ResourceName> =
Q extends 'user_info' ? UserInfo :
Q extends 'custom_abi' ? CustomAbis :
Q extends 'public_tags' ? PublicTags :
Q extends 'private_tags_address' ? AddressTags :
Q extends 'private_tags_tx' ? TransactionTags :
Q extends 'api_keys' ? ApiKeys :
Q extends 'watchlist' ? Array<WatchlistAddress> :
Q extends 'homepage_stats' ? HomeStats :
Q extends 'homepage_chart_txs' ? ChartTransactionResponse :
Q extends 'homepage_chart_market' ? ChartMarketResponse :
Q extends 'homepage_blocks' ? Array<Block> :
Q extends 'homepage_txs' ? Array<Transaction> :
Q extends 'homepage_indexing_status' ? IndexingStatus :
Q extends 'stats_counters' ? Counters :
Q extends 'stats_lines' ? StatsCharts :
Q extends 'stats_line' ? StatsChart :
Q extends 'blocks' ? BlocksResponse :
Q extends 'block' ? Block :
Q extends 'block_txs' ? BlockTransactionsResponse :
Q extends 'txs_validated' ? TransactionsResponseValidated :
Q extends 'txs_pending' ? TransactionsResponsePending :
Q extends 'tx' ? Transaction :
Q extends 'tx_internal_txs' ? InternalTransactionsResponse :
Q extends 'tx_logs' ? LogsResponseTx :
Q extends 'tx_token_transfers' ? TokenTransferResponse :
Q extends 'tx_raw_trace' ? RawTracesResponse :
Q extends 'addresses' ? AddressesResponse :
Q extends 'address' ? Address :
Q extends 'address_counters' ? AddressCounters :
Q extends 'address_txs' ? AddressTransactionsResponse :
Q extends 'address_internal_txs' ? AddressInternalTxsResponse :
Q extends 'address_token_transfers' ? AddressTokenTransferResponse :
Q extends 'address_blocks_validated' ? AddressBlocksValidatedResponse :
Q extends 'address_coin_balance' ? AddressCoinBalanceHistoryResponse :
Q extends 'address_coin_balance_chart' ? AddressCoinBalanceHistoryChart :
Q extends 'address_logs' ? LogsResponseAddress :
Q extends 'address_tokens' ? AddressTokensResponse :
Q extends 'token' ? TokenInfo :
Q extends 'token_counters' ? TokenCounters :
Q extends 'token_transfers' ? TokenTransferResponse :
Q extends 'token_holders' ? TokenHolders :
Q extends 'token_instance' ? TokenInstance :
Q extends 'token_instance_transfers_count' ? TokenInstanceTransfersCount :
Q extends 'token_inventory' ? TokenInventoryResponse :
Q extends 'tokens' ? TokensResponse :
Q extends 'search' ? SearchResult :
Q extends 'contract' ? SmartContract :
Q extends 'contract_methods_read' ? Array<SmartContractReadMethod> :
Q extends 'contract_methods_read_proxy' ? Array<SmartContractReadMethod> :
Q extends 'contract_methods_write' ? Array<SmartContractWriteMethod> :
Q extends 'contract_methods_write_proxy' ? Array<SmartContractWriteMethod> :
Q extends 'visualize_sol2uml' ? VisualizedContract :
Q extends 'contract_verification_config' ? SmartContractVerificationConfig :
never;
/* eslint-enable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/indent */
export type PaginationFilters<Q extends PaginatedResources> =
Q extends 'blocks' ? BlockFilters :
Q extends 'txs_validated' | 'txs_pending' ? TTxsFilters :
Q extends 'tx_token_transfers' ? TokenTransferFilters :
Q extends 'token_transfers' ? TokenTransferFilters :
Q extends 'address_txs' | 'address_internal_txs' ? AddressTxsFilters :
Q extends 'address_token_transfers' ? AddressTokenTransferFilters :
Q extends 'address_tokens' ? AddressTokensFilter :
Q extends 'search' ? SearchResultFilters :
Q extends 'tokens' ? TokensFilters :
never;
/* eslint-enable @typescript-eslint/indent */
