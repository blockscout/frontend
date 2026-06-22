// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { paths } from '@blockscout/api-types';
import type { AdvancedFilterParams, AdvancedFilterResponse, AdvancedFilterMethodsResponse } from 'src/features/advanced-filter/types/api';
import type { DepositsCounters, WithdrawalsResponse, WithdrawalsCounters } from 'src/features/chain-variants/beacon-chain/types/api';
import type {
  ValidatorsBlackfortCountersResponse,
  ValidatorsBlackfortResponse,
  ValidatorsBlackfortSorting,
} from 'src/features/chain-variants/blackfort/types/api';
import type { CeloEpochDetails, CeloEpochElectionRewardDetailsResponse, CeloEpochListResponse } from 'src/features/chain-variants/celo/types/api';
import type {
  ValidatorsStabilityCountersResponse,
  ValidatorsStabilityFilters,
  ValidatorsStabilityResponse,
  ValidatorsStabilitySorting,
} from 'src/features/chain-variants/stability/types/api';
import type {
  ValidatorsZilliqaResponse,
  ValidatorZilliqa,
} from 'src/features/chain-variants/zilliqa/types/api';
import type { CsvExportItemResponse, CsvExportConfig } from 'src/features/csv-export/types/api';
import type { Blob } from 'src/features/data-availability/types/api';
import type { HotContractsFilters, HotContractsResponse, HotContractsSorting } from 'src/features/hot-contracts/types/api';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';
import type { NovesAccountHistoryResponse, NovesDescribeTxsResponse, NovesResponseData } from 'src/features/tx-interpretation/noves/types/api';
import type { UserOpsResponse, UserOp, UserOpsFilters, UserOpsAccount } from 'src/features/user-ops/types/api';
import type { BackendConfig, BackendVersionConfig, CeloConfig, ContractLanguagesConfig } from 'src/slices/chain/backend-config/types/api';
import type { IndexingStatus } from 'src/slices/chain/indexing-status/types';
import type { HomeStats, ChartMarketResponse, ChartSecondaryCoinPriceResponse, ChartTransactionResponse } from 'src/slices/home/types/api';
import type { SearchRedirectResult, SearchResult, SearchResultFilters, SearchResultItem } from 'src/slices/search/types/api';

export const CORE_API_MISC_RESOURCES = {
  // WITHDRAWALS
  withdrawals: {
    path: '/api/v2/withdrawals',
    filterFields: [],
    paginated: true,
  },
  withdrawals_counters: {
    path: '/api/v2/withdrawals/counters',
  },

  // DEPOSITS
  deposits: {
    path: '/api/v2/beacon/deposits',
    filterFields: [],
    paginated: true,
  },
  deposits_counters: {
    path: '/api/v2/beacon/deposits/count',
  },

  // APP STATS
  stats: {
    path: '/api/v2/stats',
    headers: {
      'updated-gas-oracle': 'true',
    },
  },
  stats_charts_txs: {
    path: '/api/v2/stats/charts/transactions',
  },
  stats_charts_market: {
    path: '/api/v2/stats/charts/market',
  },
  stats_charts_secondary_coin_price: {
    path: '/api/v2/stats/charts/secondary-coin-market',
  },
  stats_hot_contracts: {
    path: '/api/v2/stats/hot-smart-contracts',
    paginated: true,
    filterFields: [ 'scale' as const ],
  },

  // HOMEPAGE
  homepage_blocks: {
    path: '/api/v2/main-page/blocks',
  },
  homepage_optimistic_deposits: {
    path: '/api/v2/main-page/optimism-deposits',
  },
  homepage_arbitrum_deposits: {
    path: '/api/v2/main-page/arbitrum/messages/to-rollup',
  },
  homepage_txs: {
    path: '/api/v2/main-page/transactions',
  },
  homepage_arbitrum_l2_batches: {
    path: '/api/v2/main-page/arbitrum/batches/committed',
  },
  homepage_txs_watchlist: {
    path: '/api/v2/main-page/transactions/watchlist',
  },
  homepage_indexing_status: {
    path: '/api/v2/main-page/indexing-status',
  },
  homepage_zksync_latest_batch: {
    path: '/api/v2/main-page/zksync/batches/latest-number',
  },
  homepage_arbitrum_latest_batch: {
    path: '/api/v2/main-page/arbitrum/batches/latest-number',
  },

  // SEARCH
  quick_search: {
    path: '/api/v2/search/quick',
    filterFields: [ 'q' ],
  },
  search: {
    path: '/api/v2/search',
    filterFields: [ 'q' ],
    paginated: true,
  },
  search_check_redirect: {
    path: '/api/v2/search/check-redirect',
  },

  // NOVES-FI
  noves_transaction: {
    path: '/api/v2/proxy/3rdparty/noves-fi/transactions/:hash',
    pathParams: [ 'hash' as const ],
  },
  noves_address_history: {
    path: '/api/v2/proxy/3rdparty/noves-fi/addresses/:address/transactions',
    pathParams: [ 'address' as const ],
    filterFields: [],
    paginated: true,
  },
  noves_describe_txs: {
    path: '/api/v2/proxy/3rdparty/noves-fi/transaction-descriptions',
  },

  // USER OPS
  user_ops: {
    path: '/api/v2/proxy/account-abstraction/operations',
    filterFields: [ 'transaction_hash' as const, 'sender' as const ],
    paginated: true,
  },
  user_op: {
    path: '/api/v2/proxy/account-abstraction/operations/:hash',
    pathParams: [ 'hash' as const ],
  },
  user_ops_account: {
    path: '/api/v2/proxy/account-abstraction/accounts/:hash',
    pathParams: [ 'hash' as const ],
  },
  user_op_interpretation: {
    path: '/api/v2/proxy/account-abstraction/operations/:hash/summary',
    pathParams: [ 'hash' as const ],
  },

  // VALIDATORS
  validators_stability: {
    path: '/api/v2/validators/stability',
    filterFields: [ 'address_hash' as const, 'state_filter' as const ],
    paginated: true,
  },
  validators_stability_counters: {
    path: '/api/v2/validators/stability/counters',
  },
  validators_blackfort: {
    path: '/api/v2/validators/blackfort',
    filterFields: [],
    paginated: true,
  },
  validators_blackfort_counters: {
    path: '/api/v2/validators/blackfort/counters',
  },
  validators_zilliqa: {
    path: '/api/v2/validators/zilliqa',
    filterFields: [],
    paginated: true,
  },
  validator_zilliqa: {
    path: '/api/v2/validators/zilliqa/:bls_public_key',
    pathParams: [ 'bls_public_key' as const ],
    filterFields: [],
  },

  // BLOBS
  blob: {
    path: '/api/v2/blobs/:hash',
    pathParams: [ 'hash' as const ],
  },

  // EPOCHS
  epochs_celo: {
    path: '/api/v2/celo/epochs',
    filterFields: [],
    paginated: true,
  },
  epoch_celo: {
    path: '/api/v2/celo/epochs/:number',
    pathParams: [ 'number' as const ],
  },
  epoch_celo_election_rewards: {
    path: '/api/v2/celo/epochs/:number/election-rewards/:reward_type',
    pathParams: [ 'number' as const, 'reward_type' as const ],
    filterFields: [],
    paginated: true,
  },

  // ADVANCED FILTER
  advanced_filter: {
    path: '/api/v2/advanced-filters',
    filterFields: [
      'transaction_types' as const,
      'methods' as const,
      'methods_names' as const /* frontend only */,
      'age_from' as const,
      'age_to' as const,
      'age' as const /* frontend only */,
      'from_address_hashes_to_include' as const,
      'from_address_hashes_to_exclude' as const,
      'to_address_hashes_to_include' as const,
      'to_address_hashes_to_exclude' as const,
      'address_relation' as const,
      'amount_from' as const,
      'amount_to' as const,
      'token_contract_address_hashes_to_include' as const,
      'token_contract_symbols_to_include' as const /* frontend only */,
      'token_contract_address_hashes_to_exclude' as const,
      'token_contract_symbols_to_exclude' as const /* frontend only */,
      'block_number' as const,
      'transaction_index' as const,
      'internal_transaction_index' as const,
      'token_transfer_index' as const,
    ],
    paginated: true,
  },
  advanced_filter_methods: {
    path: '/api/v2/advanced-filters/methods',
    filterFields: [ 'q' as const ],
  },
  advanced_filter_csv: {
    path: '/api/v2/advanced-filters/csv',
  },

  // CSV EXPORT
  csv_exports_item: {
    path: '/api/v2/csv-exports/:id',
    pathParams: [ 'id' as const ],
  },

  // CONFIGS
  config_backend: {
    path: '/api/v2/config/backend',
  },
  config_backend_version: {
    path: '/api/v2/config/backend-version',
  },
  config_csv_export: {
    path: '/api/v2/config/csv-export',
  },
  config_celo: {
    path: '/api/v2/config/celo',
  },
  config_contract_languages: {
    path: '/api/v2/config/smart-contracts/languages',
  },

  // OTHER
  api_v2_key: {
    path: '/api/v2/key',
  },
} satisfies Record<string, ApiResource>;

export type CoreApiMiscResourceName = `core:${ keyof typeof CORE_API_MISC_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiMiscResourcePayload<R extends CoreApiMiscResourceName> =
R extends 'core:stats' ? HomeStats :
R extends 'core:stats_charts_txs' ? ChartTransactionResponse :
R extends 'core:stats_charts_market' ? ChartMarketResponse :
R extends 'core:stats_charts_secondary_coin_price' ? ChartSecondaryCoinPriceResponse :
R extends 'core:stats_hot_contracts' ? HotContractsResponse :
R extends 'core:homepage_blocks' ? paths['/v2/main-page/blocks']['get'] :
R extends 'core:homepage_txs' ? paths['/v2/main-page/transactions']['get'] :
R extends 'core:homepage_txs_watchlist' ? paths['/v2/main-page/transactions/watchlist']['get'] :
R extends 'core:homepage_optimistic_deposits' ? paths['/v2/main-page/optimism-deposits']['get'] :
R extends 'core:homepage_arbitrum_deposits' ? paths['/v2/main-page/arbitrum/messages/to-rollup']['get'] :
R extends 'core:homepage_arbitrum_l2_batches' ? paths['/v2/main-page/arbitrum/batches/committed']['get'] :
R extends 'core:homepage_indexing_status' ? IndexingStatus :
R extends 'core:homepage_zksync_latest_batch' ? number :
R extends 'core:homepage_arbitrum_latest_batch' ? number :
R extends 'core:quick_search' ? Array<SearchResultItem> :
R extends 'core:search' ? SearchResult :
R extends 'core:search_check_redirect' ? SearchRedirectResult :
R extends 'core:config_backend' ? BackendConfig :
R extends 'core:config_backend_version' ? BackendVersionConfig :
R extends 'core:config_csv_export' ? CsvExportConfig :
R extends 'core:config_celo' ? CeloConfig :
R extends 'core:config_contract_languages' ? ContractLanguagesConfig :
R extends 'core:blob' ? Blob :
R extends 'core:validators_stability' ? ValidatorsStabilityResponse :
R extends 'core:validators_stability_counters' ? ValidatorsStabilityCountersResponse :
R extends 'core:validators_blackfort' ? ValidatorsBlackfortResponse :
R extends 'core:validators_blackfort_counters' ? ValidatorsBlackfortCountersResponse :
R extends 'core:validators_zilliqa' ? ValidatorsZilliqaResponse :
R extends 'core:validator_zilliqa' ? ValidatorZilliqa :
R extends 'core:epochs_celo' ? CeloEpochListResponse :
R extends 'core:epoch_celo' ? CeloEpochDetails :
R extends 'core:epoch_celo_election_rewards' ? CeloEpochElectionRewardDetailsResponse :
R extends 'core:user_ops' ? UserOpsResponse :
R extends 'core:user_op' ? UserOp :
R extends 'core:user_ops_account' ? UserOpsAccount :
R extends 'core:user_op_interpretation' ? TxInterpretationResponse :
R extends 'core:noves_transaction' ? NovesResponseData :
R extends 'core:noves_address_history' ? NovesAccountHistoryResponse :
R extends 'core:noves_describe_txs' ? NovesDescribeTxsResponse :
R extends 'core:withdrawals' ? WithdrawalsResponse :
R extends 'core:withdrawals_counters' ? WithdrawalsCounters :
R extends 'core:deposits' ? paths['/v2/beacon/deposits']['get'] :
R extends 'core:deposits_counters' ? DepositsCounters :
R extends 'core:advanced_filter' ? AdvancedFilterResponse :
R extends 'core:advanced_filter_methods' ? AdvancedFilterMethodsResponse :
R extends 'core:csv_exports_item' ? CsvExportItemResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiMiscPaginationFilters<R extends CoreApiMiscResourceName> =
R extends 'core:stats_hot_contracts' ? HotContractsFilters :
R extends 'core:search' ? SearchResultFilters :
R extends 'core:user_ops' ? UserOpsFilters :
R extends 'core:validators_stability' ? ValidatorsStabilityFilters :
R extends 'core:advanced_filter' ? AdvancedFilterParams :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiMiscPaginationSorting<R extends CoreApiMiscResourceName> =
R extends 'core:stats_hot_contracts' ? HotContractsSorting :
R extends 'core:validators_stability' ? ValidatorsStabilitySorting :
R extends 'core:validators_blackfort' ? ValidatorsBlackfortSorting :
never;
/* eslint-enable @stylistic/indent */
