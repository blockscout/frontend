import type ArrayElement from 'types/utils/ArrayElement';

import appConfig from 'configs/app/config';

export interface ApiResource {
  path: string;
  endpoint?: string;
  basePath?: string;
}

export const RESOURCES = {
  // ACCOUNT
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
  stats_charts: {
    path: '/api/v1/charts/line',
    endpoint: appConfig.statsApi.endpoint,
    basePath: appConfig.statsApi.basePath,
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

  // ADDRESS
  address: {
    path: '/api/v2/addresses/:id',
  },
  address_counters: {
    path: '/api/v2/addresses/:id/counters',
  },
  address_token_balances: {
    path: '/api/v2/addresses/:id/token-balances',
  },
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
    filterFields: [ 'filter' as const, 'type' as const ],
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
  error?: T;
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

export type ResourceErrorAccount<T> = ResourceError<{ errors: T }>
