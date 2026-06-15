// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { merged } from '@blockscout/api-types';
import type { AddressesMetadataSearchFilters, AddressesMetadataSearchResult } from 'src/features/address-metadata/types/api';
import type { DepositsResponse } from 'src/features/chain-variants/beacon-chain/types/api';
import type { AddressEpochRewardsResponse } from 'src/features/chain-variants/celo/types/api';
import type {
  AddressCounters,
  AddressBlocksValidatedResponse,
  AddressWithdrawalsResponse,
  AddressXStarResponse,
  AddressCoinBalanceHistoryChart,
  AddressCoinBalanceHistoryResponse,
  AddressInternalTxsResponse,
  AddressTransactionsResponse,
  AddressTabsCounters,
  AddressTxsFilters,
  AddressTokenTransferFilters,
  AddressTokensFilter,
  AddressNFTTokensFilter,
} from 'src/slices/address/types/api';
import type { LogsResponseAddress } from 'src/slices/log/types/api';
import type { TransactionsSorting } from 'src/slices/tx/types/api';

export const CORE_API_ADDRESS_RESOURCES = {
  // ADDRESSES
  addresses: {
    path: '/api/v2/addresses/',
    filterFields: [ ],
    paginated: true,
  },
  addresses_metadata_search: {
    path: '/api/v2/proxy/metadata/addresses',
    filterFields: [ 'slug' as const, 'tag_type' as const ],
    paginated: true,
  },

  // ADDRESS INFO
  address: {
    path: '/api/v2/addresses/:hash',
    pathParams: [ 'hash' as const ],
  },
  address_counters: {
    path: '/api/v2/addresses/:hash/counters',
    pathParams: [ 'hash' as const ],
  },
  address_tabs_counters: {
    path: '/api/v2/addresses/:hash/tabs-counters',
    pathParams: [ 'hash' as const ],
  },
  address_txs: {
    path: '/api/v2/addresses/:hash/transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const ],
    paginated: true,
  },
  address_internal_txs: {
    path: '/api/v2/addresses/:hash/internal-transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const ],
    paginated: true,
  },
  address_token_transfers: {
    path: '/api/v2/addresses/:hash/token-transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const, 'type' as const, 'token' as const ],
    paginated: true,
  },
  address_blocks_validated: {
    path: '/api/v2/addresses/:hash/blocks-validated',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  address_coin_balance: {
    path: '/api/v2/addresses/:hash/coin-balance-history',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  address_coin_balance_chart: {
    path: '/api/v2/addresses/:hash/coin-balance-history-by-day',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  address_logs: {
    path: '/api/v2/addresses/:hash/logs',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
    paginated: true,
  },
  address_tokens: {
    path: '/api/v2/addresses/:hash/tokens',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  address_token_balances: {
    path: '/api/v2/addresses/:hash/token-balances',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  address_nfts: {
    path: '/api/v2/addresses/:hash/nft',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  address_collections: {
    path: '/api/v2/addresses/:hash/nft/collections',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  address_deposits: {
    path: '/api/v2/addresses/:hash/beacon/deposits',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  address_withdrawals: {
    path: '/api/v2/addresses/:hash/withdrawals',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  address_epoch_rewards: {
    path: '/api/v2/addresses/:hash/celo/election-rewards',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  address_xstar_score: {
    path: '/api/v2/proxy/3rdparty/xname/addresses/:hash',
    pathParams: [ 'hash' as const ],
  },
  address_3rd_party_info: {
    path: '/api/v2/proxy/3rdparty/:name',
    pathParams: [ 'name' as const ],
    filterFields: [ 'address' as const, 'chain_id' as const ],
  },

  // CSV EXPORTS
  address_csv_export_txs: {
    path: '/api/v2/addresses/:hash/transactions/csv',
    pathParams: [ 'hash' as const ],
  },
  address_csv_export_internal_txs: {
    path: '/api/v2/addresses/:hash/internal-transactions/csv',
    pathParams: [ 'hash' as const ],
  },
  address_csv_export_token_transfers: {
    path: '/api/v2/addresses/:hash/token-transfers/csv',
    pathParams: [ 'hash' as const ],
  },
  address_csv_export_logs: {
    path: '/api/v2/addresses/:hash/logs/csv',
    pathParams: [ 'hash' as const ],
  },
  address_csv_export_celo_election_rewards: {
    path: '/api/v2/addresses/:hash/celo/election-rewards/csv',
    pathParams: [ 'hash' as const ],
  },
} satisfies Record<string, ApiResource>;

export type CoreApiAddressResourceName = `core:${ keyof typeof CORE_API_ADDRESS_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiAddressResourcePayload<R extends CoreApiAddressResourceName> =
R extends 'core:addresses' ? merged.paths['/v2/addresses']['get']['responses']['200']['content']['application/json'] :
R extends 'core:addresses_metadata_search' ? AddressesMetadataSearchResult :
R extends 'core:address' ? merged.paths['/v2/addresses/{address_hash_param}']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_counters' ? AddressCounters :
R extends 'core:address_tabs_counters' ? AddressTabsCounters :
R extends 'core:address_txs' ? AddressTransactionsResponse :
R extends 'core:address_internal_txs' ? AddressInternalTxsResponse :
R extends 'core:address_token_transfers' ?
  merged.paths['/v2/addresses/{address_hash_param}/token-transfers']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_blocks_validated' ? AddressBlocksValidatedResponse :
R extends 'core:address_coin_balance' ? AddressCoinBalanceHistoryResponse :
R extends 'core:address_coin_balance_chart' ? AddressCoinBalanceHistoryChart :
R extends 'core:address_logs' ? LogsResponseAddress :
R extends 'core:address_tokens' ? merged.paths['/v2/addresses/{address_hash_param}/tokens']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_token_balances' ?
  merged.paths['/v2/addresses/{address_hash_param}/token-balances']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_nfts' ? merged.paths['/v2/addresses/{address_hash_param}/nft']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_collections' ?
  merged.paths['/v2/addresses/{address_hash_param}/nft/collections']['get']['responses']['200']['content']['application/json'] :
R extends 'core:address_withdrawals' ? AddressWithdrawalsResponse :
R extends 'core:address_deposits' ? DepositsResponse :
R extends 'core:address_epoch_rewards' ? AddressEpochRewardsResponse :
R extends 'core:address_xstar_score' ? AddressXStarResponse :
R extends 'core:address_3rd_party_info' ? unknown :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiAddressPaginationFilters<R extends CoreApiAddressResourceName> =
R extends 'core:addresses_metadata_search' ? AddressesMetadataSearchFilters :
R extends 'core:address_txs' | 'core:address_internal_txs' ? AddressTxsFilters :
R extends 'core:address_token_transfers' ? AddressTokenTransferFilters :
R extends 'core:address_tokens' ? AddressTokensFilter :
R extends 'core:address_nfts' ? AddressNFTTokensFilter :
R extends 'core:address_collections' ? AddressNFTTokensFilter :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiAddressPaginationSorting<R extends CoreApiAddressResourceName> =
R extends 'core:address_txs' ? TransactionsSorting :
never;
/* eslint-enable @stylistic/indent */
