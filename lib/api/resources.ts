import { getFeaturePayload } from 'configs/app/features/types';
import type {
  UserInfo,
  CustomAbis,
  PublicTags,
  ApiKeys,
  VerifiedAddressResponse,
  TokenInfoApplicationConfig,
  TokenInfoApplications,
  WatchlistResponse,
  TransactionTagsResponse,
  AddressTagsResponse,
} from 'types/api/account';
import type {
  Address,
  AddressCounters,
  AddressTabsCounters,
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
  AddressWithdrawalsResponse,
  AddressNFTsResponse,
  AddressCollectionsResponse,
  AddressNFTTokensFilter,
} from 'types/api/address';
import type { AddressesResponse } from 'types/api/addresses';
import type { BlocksResponse, BlockTransactionsResponse, Block, BlockFilters, BlockWithdrawalsResponse } from 'types/api/block';
import type { ChartMarketResponse, ChartTransactionResponse } from 'types/api/charts';
import type { BackendVersionConfig } from 'types/api/configs';
import type {
  SmartContract,
  SmartContractReadMethod,
  SmartContractWriteMethod,
  SmartContractVerificationConfig,
  SolidityscanReport,
  SmartContractSecurityAudits,
} from 'types/api/contract';
import type { VerifiedContractsResponse, VerifiedContractsFilters, VerifiedContractsCounters } from 'types/api/contracts';
import type {
  EnsAddressLookupFilters,
  EnsAddressLookupResponse,
  EnsDomainDetailed,
  EnsDomainEventsResponse,
  EnsDomainLookupFilters,
  EnsDomainLookupResponse,
  EnsLookupSorting,
} from 'types/api/ens';
import type { IndexingStatus } from 'types/api/indexingStatus';
import type { InternalTransactionsResponse } from 'types/api/internalTransaction';
import type { LogsResponseTx, LogsResponseAddress } from 'types/api/log';
import type {
  OptimisticL2DepositsResponse,
  OptimisticL2DepositsItem,
  OptimisticL2OutputRootsResponse,
  OptimisticL2TxnBatchesResponse,
  OptimisticL2WithdrawalsResponse,
} from 'types/api/optimisticL2';
import type { RawTracesResponse } from 'types/api/rawTrace';
import type { SearchRedirectResult, SearchResult, SearchResultFilters, SearchResultItem } from 'types/api/search';
import type { ShibariumWithdrawalsResponse, ShibariumDepositsResponse } from 'types/api/shibarium';
import type { Counters, StatsCharts, StatsChart, HomeStats } from 'types/api/stats';
import type {
  TokenCounters,
  TokenInfo,
  TokenHolders,
  TokenInventoryResponse,
  TokenInstance,
  TokenInstanceTransfersCount,
  TokenVerifiedInfo,
  TokenInventoryFilters,
} from 'types/api/token';
import type { TokensResponse, TokensFilters, TokensSorting, TokenInstanceTransferResponse, TokensBridgedFilters } from 'types/api/tokens';
import type { TokenTransferResponse, TokenTransferFilters } from 'types/api/tokenTransfer';
import type {
  TransactionsResponseValidated,
  TransactionsResponsePending,
  Transaction,
  TransactionsResponseWatchlist,
  TransactionsSorting,
} from 'types/api/transaction';
import type { TxInterpretationResponse } from 'types/api/txInterpretation';
import type { TTxsFilters } from 'types/api/txsFilters';
import type { TxStateChanges } from 'types/api/txStateChanges';
import type { UserOpsResponse, UserOp, UserOpsFilters, UserOpsAccount } from 'types/api/userOps';
import type { ValidatorsCountersResponse, ValidatorsFilters, ValidatorsResponse, ValidatorsSorting } from 'types/api/validators';
import type { VerifiedContractsSorting } from 'types/api/verifiedContracts';
import type { VisualizedContract } from 'types/api/visualization';
import type { WithdrawalsResponse, WithdrawalsCounters } from 'types/api/withdrawals';
import type { ZkEvmL2TxnBatch, ZkEvmL2TxnBatchesItem, ZkEvmL2TxnBatchesResponse, ZkEvmL2TxnBatchTxs } from 'types/api/zkEvmL2';
import type { MarketplaceAppOverview } from 'types/client/marketplace';
import type { ArrayElement } from 'types/utils';

import config from 'configs/app';

const marketplaceFeature = getFeaturePayload(config.features.marketplace);
const marketplaceApi = marketplaceFeature && 'api' in marketplaceFeature ? marketplaceFeature.api : undefined;

export interface ApiResource {
  path: ResourcePath;
  endpoint?: string;
  basePath?: string;
  pathParams?: Array<string>;
  needAuth?: boolean; // for external APIs which require authentication
  headers?: RequestInit['headers'];
}

export const SORTING_FIELDS = [ 'sort', 'order' ];

export const RESOURCES = {
  // ACCOUNT
  csrf: {
    path: '/api/account/v2/get_csrf',
  },
  user_info: {
    path: '/api/account/v2/user/info',
  },
  email_resend: {
    path: '/api/account/v2/email/resend',
  },
  custom_abi: {
    path: '/api/account/v2/user/custom_abis/:id?',
    pathParams: [ 'id' as const ],
  },
  watchlist: {
    path: '/api/account/v2/user/watchlist/:id?',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  public_tags: {
    path: '/api/account/v2/user/public_tags/:id?',
    pathParams: [ 'id' as const ],
  },
  private_tags_address: {
    path: '/api/account/v2/user/tags/address/:id?',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  private_tags_tx: {
    path: '/api/account/v2/user/tags/transaction/:id?',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  api_keys: {
    path: '/api/account/v2/user/api_keys/:id?',
    pathParams: [ 'id' as const ],
  },

  // ACCOUNT: ADDRESS VERIFICATION & TOKEN INFO
  address_verification: {
    path: '/api/v1/chains/:chainId/verified-addresses:type',
    pathParams: [ 'chainId' as const, 'type' as const ],
    endpoint: getFeaturePayload(config.features.verifiedTokens)?.api.endpoint,
    basePath: getFeaturePayload(config.features.verifiedTokens)?.api.basePath,
    needAuth: true,
  },

  verified_addresses: {
    path: '/api/v1/chains/:chainId/verified-addresses',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.verifiedTokens)?.api.endpoint,
    basePath: getFeaturePayload(config.features.verifiedTokens)?.api.basePath,
    needAuth: true,
  },

  token_info_applications_config: {
    path: '/api/v1/chains/:chainId/token-info-submissions/selectors',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.addressVerification)?.api.endpoint,
    basePath: getFeaturePayload(config.features.addressVerification)?.api.basePath,
    needAuth: true,
  },

  token_info_applications: {
    path: '/api/v1/chains/:chainId/token-info-submissions/:id?',
    pathParams: [ 'chainId' as const, 'id' as const ],
    endpoint: getFeaturePayload(config.features.addressVerification)?.api.endpoint,
    basePath: getFeaturePayload(config.features.addressVerification)?.api.basePath,
    needAuth: true,
  },

  // STATS MICROSERVICE API
  stats_counters: {
    path: '/api/v1/counters',
    endpoint: getFeaturePayload(config.features.stats)?.api.endpoint,
    basePath: getFeaturePayload(config.features.stats)?.api.basePath,
  },
  stats_lines: {
    path: '/api/v1/lines',
    endpoint: getFeaturePayload(config.features.stats)?.api.endpoint,
    basePath: getFeaturePayload(config.features.stats)?.api.basePath,
  },
  stats_line: {
    path: '/api/v1/lines/:id',
    pathParams: [ 'id' as const ],
    endpoint: getFeaturePayload(config.features.stats)?.api.endpoint,
    basePath: getFeaturePayload(config.features.stats)?.api.basePath,
  },

  // NAME SERVICE
  addresses_lookup: {
    path: '/api/v1/:chainId/addresses\\:lookup',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
    filterFields: [ 'address' as const, 'resolved_to' as const, 'owned_by' as const, 'only_active' as const ],
  },
  domain_info: {
    path: '/api/v1/:chainId/domains/:name',
    pathParams: [ 'chainId' as const, 'name' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
  },
  domain_events: {
    path: '/api/v1/:chainId/domains/:name/events',
    pathParams: [ 'chainId' as const, 'name' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
  },
  domains_lookup: {
    path: '/api/v1/:chainId/domains\\:lookup',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
    filterFields: [ 'name' as const, 'only_active' as const ],
  },

  // VISUALIZATION
  visualize_sol2uml: {
    path: '/api/v1/solidity\\:visualize-contracts',
    endpoint: getFeaturePayload(config.features.sol2uml)?.api.endpoint,
    basePath: getFeaturePayload(config.features.sol2uml)?.api.basePath,
  },

  // MARKETPLACE
  marketplace_dapps: {
    path: '/api/v1/chains/:chainId/marketplace/dapps',
    pathParams: [ 'chainId' as const ],
    endpoint: marketplaceApi?.endpoint,
    basePath: marketplaceApi?.basePath,
  },
  marketplace_dapp: {
    path: '/api/v1/chains/:chainId/marketplace/dapps/:dappId',
    pathParams: [ 'chainId' as const, 'dappId' as const ],
    endpoint: marketplaceApi?.endpoint,
    basePath: marketplaceApi?.basePath,
  },

  // BLOCKS, TXS
  blocks: {
    path: '/api/v2/blocks',
    filterFields: [ 'type' as const ],
  },
  block: {
    path: '/api/v2/blocks/:height_or_hash',
    pathParams: [ 'height_or_hash' as const ],
  },
  block_txs: {
    path: '/api/v2/blocks/:height_or_hash/transactions',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
  },
  block_withdrawals: {
    path: '/api/v2/blocks/:height_or_hash/withdrawals',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
  },
  txs_validated: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  txs_pending: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  txs_watchlist: {
    path: '/api/v2/transactions/watchlist',
    filterFields: [ ],
  },
  txs_execution_node: {
    path: '/api/v2/transactions/execution-node/:hash',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  tx: {
    path: '/api/v2/transactions/:hash',
    pathParams: [ 'hash' as const ],
  },
  tx_internal_txs: {
    path: '/api/v2/transactions/:hash/internal-transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  tx_logs: {
    path: '/api/v2/transactions/:hash/logs',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  tx_token_transfers: {
    path: '/api/v2/transactions/:hash/token-transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
  },
  tx_raw_trace: {
    path: '/api/v2/transactions/:hash/raw-trace',
    pathParams: [ 'hash' as const ],
  },
  tx_state_changes: {
    path: '/api/v2/transactions/:hash/state-changes',
    pathParams: [ 'hash' as const ],
    filterFields: [],
  },
  tx_interpretation: {
    path: '/api/v2/transactions/:hash/summary',
    pathParams: [ 'hash' as const ],
  },
  withdrawals: {
    path: '/api/v2/withdrawals',
    filterFields: [],
  },
  withdrawals_counters: {
    path: '/api/v2/withdrawals/counters',
  },

  // ADDRESSES
  addresses: {
    path: '/api/v2/addresses/',
    filterFields: [ ],
  },

  // ADDRESS
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
  // this resource doesn't have pagination, so causing huge problems on some addresses page
  // address_token_balances: {
  //   path: '/api/v2/addresses/:hash/token-balances',
  // },
  address_txs: {
    path: '/api/v2/addresses/:hash/transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const ],
  },
  address_internal_txs: {
    path: '/api/v2/addresses/:hash/internal-transactions',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const ],
  },
  address_token_transfers: {
    path: '/api/v2/addresses/:hash/token-transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'filter' as const, 'type' as const, 'token' as const ],
  },
  address_blocks_validated: {
    path: '/api/v2/addresses/:hash/blocks-validated',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  address_coin_balance: {
    path: '/api/v2/addresses/:hash/coin-balance-history',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  address_coin_balance_chart: {
    path: '/api/v2/addresses/:hash/coin-balance-history-by-day',
    pathParams: [ 'hash' as const ],
  },
  address_logs: {
    path: '/api/v2/addresses/:hash/logs',
    pathParams: [ 'hash' as const ],
    filterFields: [ ],
  },
  address_tokens: {
    path: '/api/v2/addresses/:hash/tokens',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
  },
  address_nfts: {
    path: '/api/v2/addresses/:hash/nft',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
  },
  address_collections: {
    path: '/api/v2/addresses/:hash/nft/collections',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'type' as const ],
  },
  address_withdrawals: {
    path: '/api/v2/addresses/:hash/withdrawals',
    pathParams: [ 'hash' as const ],
    filterFields: [],
  },

  // CONTRACT
  contract: {
    path: '/api/v2/smart-contracts/:hash',
    pathParams: [ 'hash' as const ],
  },
  contract_methods_read: {
    path: '/api/v2/smart-contracts/:hash/methods-read',
    pathParams: [ 'hash' as const ],
  },
  contract_methods_read_proxy: {
    path: '/api/v2/smart-contracts/:hash/methods-read-proxy',
    pathParams: [ 'hash' as const ],
  },
  contract_method_query: {
    path: '/api/v2/smart-contracts/:hash/query-read-method',
    pathParams: [ 'hash' as const ],
  },
  contract_methods_write: {
    path: '/api/v2/smart-contracts/:hash/methods-write',
    pathParams: [ 'hash' as const ],
  },
  contract_methods_write_proxy: {
    path: '/api/v2/smart-contracts/:hash/methods-write-proxy',
    pathParams: [ 'hash' as const ],
  },
  contract_verification_config: {
    path: '/api/v2/smart-contracts/verification/config',
  },
  contract_verification_via: {
    path: '/api/v2/smart-contracts/:hash/verification/via/:method',
    pathParams: [ 'hash' as const, 'method' as const ],
  },
  contract_solidityscan_report: {
    path: '/api/v2/smart-contracts/:hash/solidityscan-report',
    pathParams: [ 'hash' as const ],
  },
  contract_security_audits: {
    path: '/api/v2/smart-contracts/:hash/audit-reports',
    pathParams: [ 'hash' as const ],
  },

  verified_contracts: {
    path: '/api/v2/smart-contracts',
    filterFields: [ 'q' as const, 'filter' as const ],
  },
  verified_contracts_counters: {
    path: '/api/v2/smart-contracts/counters',
  },

  // TOKEN
  token: {
    path: '/api/v2/tokens/:hash',
    pathParams: [ 'hash' as const ],
  },
  token_verified_info: {
    path: '/api/v1/chains/:chainId/token-infos/:hash',
    pathParams: [ 'chainId' as const, 'hash' as const ],
    endpoint: getFeaturePayload(config.features.verifiedTokens)?.api.endpoint,
    basePath: getFeaturePayload(config.features.verifiedTokens)?.api.basePath,
  },
  token_counters: {
    path: '/api/v2/tokens/:hash/counters',
    pathParams: [ 'hash' as const ],
  },
  token_holders: {
    path: '/api/v2/tokens/:hash/holders',
    pathParams: [ 'hash' as const ],
    filterFields: [],
  },
  token_transfers: {
    path: '/api/v2/tokens/:hash/transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [],
  },
  token_inventory: {
    path: '/api/v2/tokens/:hash/instances',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'holder_address_hash' as const ],
  },
  tokens: {
    path: '/api/v2/tokens',
    filterFields: [ 'q' as const, 'type' as const ],
  },
  tokens_bridged: {
    path: '/api/v2/tokens/bridged',
    filterFields: [ 'q' as const, 'chain_ids' as const ],
  },

  // TOKEN INSTANCE
  token_instance: {
    path: '/api/v2/tokens/:hash/instances/:id',
    pathParams: [ 'hash' as const, 'id' as const ],
  },
  token_instance_transfers_count: {
    path: '/api/v2/tokens/:hash/instances/:id/transfers-count',
    pathParams: [ 'hash' as const, 'id' as const ],
  },
  token_instance_transfers: {
    path: '/api/v2/tokens/:hash/instances/:id/transfers',
    pathParams: [ 'hash' as const, 'id' as const ],
    filterFields: [],
  },
  token_instance_holders: {
    path: '/api/v2/tokens/:hash/instances/:id/holders',
    pathParams: [ 'hash' as const, 'id' as const ],
    filterFields: [],
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

  // HOMEPAGE
  homepage_blocks: {
    path: '/api/v2/main-page/blocks',
  },
  homepage_deposits: {
    path: '/api/v2/main-page/optimism-deposits',
  },
  homepage_txs: {
    path: '/api/v2/main-page/transactions',
  },
  homepage_zkevm_l2_batches: {
    path: '/api/v2/main-page/zkevm/batches/confirmed',
  },
  homepage_txs_watchlist: {
    path: '/api/v2/main-page/transactions/watchlist',
  },
  homepage_indexing_status: {
    path: '/api/v2/main-page/indexing-status',
  },
  homepage_zkevm_latest_batch: {
    path: '/api/v2/main-page/zkevm/batches/latest-number',
  },

  // SEARCH
  quick_search: {
    path: '/api/v2/search/quick',
    filterFields: [ 'q' ],
  },
  search: {
    path: '/api/v2/search',
    filterFields: [ 'q' ],
  },
  search_check_redirect: {
    path: '/api/v2/search/check-redirect',
  },

  // L2
  l2_deposits: {
    path: '/api/v2/optimism/deposits',
    filterFields: [],
  },

  l2_deposits_count: {
    path: '/api/v2/optimism/deposits/count',
  },

  l2_withdrawals: {
    path: '/api/v2/optimism/withdrawals',
    filterFields: [],
  },

  l2_withdrawals_count: {
    path: '/api/v2/optimism/withdrawals/count',
  },

  l2_output_roots: {
    path: '/api/v2/optimism/output-roots',
    filterFields: [],
  },

  l2_output_roots_count: {
    path: '/api/v2/optimism/output-roots/count',
  },

  l2_txn_batches: {
    path: '/api/v2/optimism/txn-batches',
    filterFields: [],
  },

  l2_txn_batches_count: {
    path: '/api/v2/optimism/txn-batches/count',
  },

  zkevm_l2_txn_batches: {
    path: '/api/v2/zkevm/batches',
    filterFields: [],
  },

  zkevm_l2_txn_batches_count: {
    path: '/api/v2/zkevm/batches/count',
  },

  zkevm_l2_txn_batch: {
    path: '/api/v2/zkevm/batches/:number',
    pathParams: [ 'number' as const ],
  },
  zkevm_l2_txn_batch_txs: {
    path: '/api/v2/transactions/zkevm-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
  },

  // SHIBARIUM L2
  shibarium_deposits: {
    path: '/api/v2/shibarium/deposits',
    filterFields: [],
  },

  shibarium_deposits_count: {
    path: '/api/v2/shibarium/deposits/count',
  },

  shibarium_withdrawals: {
    path: '/api/v2/shibarium/withdrawals',
    filterFields: [],
  },

  shibarium_withdrawals_count: {
    path: '/api/v2/shibarium/withdrawals/count',
  },

  // USER OPS
  user_ops: {
    path: '/api/v2/proxy/account-abstraction/operations',
    filterFields: [ 'transaction_hash' as const, 'sender' as const ],
  },
  user_op: {
    path: '/api/v2/proxy/account-abstraction/operations/:hash',
    pathParams: [ 'hash' as const ],
  },
  user_ops_account: {
    path: '/api/v2/proxy/account-abstraction/accounts/:hash',
    pathParams: [ 'hash' as const ],
  },

  // VALIDATORS
  validators: {
    path: '/api/v2/validators/:chainType',
    pathParams: [ 'chainType' as const ],
    filterFields: [ 'address_hash' as const, 'state_filter' as const ],
  },
  validators_counters: {
    path: '/api/v2/validators/:chainType/counters',
    pathParams: [ 'chainType' as const ],
  },

  // CONFIGS
  config_backend_version: {
    path: '/api/v2/config/backend-version',
  },

  // OTHER
  api_v2_key: {
    path: '/api/v2/key',
  },

  // API V1
  csv_export_txs: {
    path: '/api/v1/transactions-csv',
  },
  csv_export_internal_txs: {
    path: '/api/v1/internal-transactions-csv',
  },
  csv_export_token_transfers: {
    path: '/api/v1/token-transfers-csv',
  },
  csv_export_logs: {
    path: '/api/v1/logs-csv',
  },
  graphql: {
    path: '/api/v1/graphql',
  },
};

export type ResourceName = keyof typeof RESOURCES;

type ResourcePathMap = {
  [K in ResourceName]: typeof RESOURCES[K]['path']
}
export type ResourcePath = ResourcePathMap[keyof ResourcePathMap]

export type ResourceFiltersKey<R extends ResourceName> = typeof RESOURCES[R] extends {filterFields: Array<unknown>} ?
  ArrayElement<typeof RESOURCES[R]['filterFields']> :
  never;

export const resourceKey = (x: keyof typeof RESOURCES) => x;

type ResourcePathParamName<Resource extends ResourceName> =
  typeof RESOURCES[Resource] extends { pathParams: Array<string> } ?
    ArrayElement<typeof RESOURCES[Resource]['pathParams']> :
    string;

export type ResourcePathParams<Resource extends ResourceName> = typeof RESOURCES[Resource] extends { pathParams: Array<string> } ?
  Record<ResourcePathParamName<Resource>, string | undefined> :
  never;

export interface ResourceError<T = unknown> {
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

export type ResourceErrorAccount<T> = ResourceError<{ errors: T }>

export type PaginatedResources = 'blocks' | 'block_txs' |
'txs_validated' | 'txs_pending' | 'txs_watchlist' | 'txs_execution_node' |
'tx_internal_txs' | 'tx_logs' | 'tx_token_transfers' | 'tx_state_changes' |
'addresses' |
'address_txs' | 'address_internal_txs' | 'address_token_transfers' | 'address_blocks_validated' | 'address_coin_balance' |
'search' |
'address_logs' | 'address_tokens' | 'address_nfts' | 'address_collections' |
'token_transfers' | 'token_holders' | 'token_inventory' | 'tokens' | 'tokens_bridged' |
'token_instance_transfers' | 'token_instance_holders' |
'verified_contracts' |
'l2_output_roots' | 'l2_withdrawals' | 'l2_txn_batches' | 'l2_deposits' |
'shibarium_deposits' | 'shibarium_withdrawals' |
'zkevm_l2_txn_batches' | 'zkevm_l2_txn_batch_txs' |
'withdrawals' | 'address_withdrawals' | 'block_withdrawals' |
'watchlist' | 'private_tags_address' | 'private_tags_tx' |
'domains_lookup' | 'addresses_lookup' | 'user_ops' | 'validators';

export type PaginatedResponse<Q extends PaginatedResources> = ResourcePayload<Q>;

/* eslint-disable @typescript-eslint/indent */
// !!! IMPORTANT !!!
// Don't add any new types here because TypeScript cannot handle it properly
// use ResourcePayloadB instead
export type ResourcePayloadA<Q extends ResourceName> =
Q extends 'user_info' ? UserInfo :
Q extends 'custom_abi' ? CustomAbis :
Q extends 'public_tags' ? PublicTags :
Q extends 'private_tags_address' ? AddressTagsResponse :
Q extends 'private_tags_tx' ? TransactionTagsResponse :
Q extends 'api_keys' ? ApiKeys :
Q extends 'watchlist' ? WatchlistResponse :
Q extends 'verified_addresses' ? VerifiedAddressResponse :
Q extends 'token_info_applications_config' ? TokenInfoApplicationConfig :
Q extends 'token_info_applications' ? TokenInfoApplications :
Q extends 'stats' ? HomeStats :
Q extends 'stats_charts_txs' ? ChartTransactionResponse :
Q extends 'stats_charts_market' ? ChartMarketResponse :
Q extends 'homepage_blocks' ? Array<Block> :
Q extends 'homepage_txs' ? Array<Transaction> :
Q extends 'homepage_txs_watchlist' ? Array<Transaction> :
Q extends 'homepage_deposits' ? Array<OptimisticL2DepositsItem> :
Q extends 'homepage_zkevm_l2_batches' ? { items: Array<ZkEvmL2TxnBatchesItem> } :
Q extends 'homepage_indexing_status' ? IndexingStatus :
Q extends 'homepage_zkevm_latest_batch' ? number :
Q extends 'stats_counters' ? Counters :
Q extends 'stats_lines' ? StatsCharts :
Q extends 'stats_line' ? StatsChart :
Q extends 'blocks' ? BlocksResponse :
Q extends 'block' ? Block :
Q extends 'block_txs' ? BlockTransactionsResponse :
Q extends 'block_withdrawals' ? BlockWithdrawalsResponse :
Q extends 'txs_validated' ? TransactionsResponseValidated :
Q extends 'txs_pending' ? TransactionsResponsePending :
Q extends 'txs_watchlist' ? TransactionsResponseWatchlist :
Q extends 'txs_execution_node' ? TransactionsResponseValidated :
Q extends 'tx' ? Transaction :
Q extends 'tx_internal_txs' ? InternalTransactionsResponse :
Q extends 'tx_logs' ? LogsResponseTx :
Q extends 'tx_token_transfers' ? TokenTransferResponse :
Q extends 'tx_raw_trace' ? RawTracesResponse :
Q extends 'tx_state_changes' ? TxStateChanges :
Q extends 'tx_interpretation' ? TxInterpretationResponse :
Q extends 'addresses' ? AddressesResponse :
Q extends 'address' ? Address :
Q extends 'address_counters' ? AddressCounters :
Q extends 'address_tabs_counters' ? AddressTabsCounters :
Q extends 'address_txs' ? AddressTransactionsResponse :
Q extends 'address_internal_txs' ? AddressInternalTxsResponse :
Q extends 'address_token_transfers' ? AddressTokenTransferResponse :
Q extends 'address_blocks_validated' ? AddressBlocksValidatedResponse :
Q extends 'address_coin_balance' ? AddressCoinBalanceHistoryResponse :
Q extends 'address_coin_balance_chart' ? AddressCoinBalanceHistoryChart :
Q extends 'address_logs' ? LogsResponseAddress :
Q extends 'address_tokens' ? AddressTokensResponse :
Q extends 'address_nfts' ? AddressNFTsResponse :
Q extends 'address_collections' ? AddressCollectionsResponse :
Q extends 'address_withdrawals' ? AddressWithdrawalsResponse :
Q extends 'token' ? TokenInfo :
Q extends 'token_verified_info' ? TokenVerifiedInfo :
Q extends 'token_counters' ? TokenCounters :
Q extends 'token_transfers' ? TokenTransferResponse :
Q extends 'token_holders' ? TokenHolders :
Q extends 'token_instance' ? TokenInstance :
Q extends 'token_instance_transfers_count' ? TokenInstanceTransfersCount :
Q extends 'token_instance_transfers' ? TokenInstanceTransferResponse :
Q extends 'token_instance_holders' ? TokenHolders :
Q extends 'token_inventory' ? TokenInventoryResponse :
Q extends 'tokens' ? TokensResponse :
Q extends 'tokens_bridged' ? TokensResponse :
Q extends 'quick_search' ? Array<SearchResultItem> :
Q extends 'search' ? SearchResult :
Q extends 'search_check_redirect' ? SearchRedirectResult :
Q extends 'contract' ? SmartContract :
Q extends 'contract_methods_read' ? Array<SmartContractReadMethod> :
Q extends 'contract_methods_read_proxy' ? Array<SmartContractReadMethod> :
Q extends 'contract_methods_write' ? Array<SmartContractWriteMethod> :
Q extends 'contract_methods_write_proxy' ? Array<SmartContractWriteMethod> :
Q extends 'contract_solidityscan_report' ? SolidityscanReport :
Q extends 'verified_contracts' ? VerifiedContractsResponse :
Q extends 'verified_contracts_counters' ? VerifiedContractsCounters :
Q extends 'visualize_sol2uml' ? VisualizedContract :
Q extends 'contract_verification_config' ? SmartContractVerificationConfig :
Q extends 'withdrawals' ? WithdrawalsResponse :
Q extends 'withdrawals_counters' ? WithdrawalsCounters :
Q extends 'l2_output_roots' ? OptimisticL2OutputRootsResponse :
Q extends 'l2_withdrawals' ? OptimisticL2WithdrawalsResponse :
Q extends 'l2_deposits' ? OptimisticL2DepositsResponse :
Q extends 'l2_txn_batches' ? OptimisticL2TxnBatchesResponse :
Q extends 'l2_output_roots_count' ? number :
Q extends 'l2_withdrawals_count' ? number :
Q extends 'l2_deposits_count' ? number :
Q extends 'l2_txn_batches_count' ? number :
Q extends 'zkevm_l2_txn_batches' ? ZkEvmL2TxnBatchesResponse :
Q extends 'zkevm_l2_txn_batches_count' ? number :
Q extends 'zkevm_l2_txn_batch' ? ZkEvmL2TxnBatch :
Q extends 'zkevm_l2_txn_batch_txs' ? ZkEvmL2TxnBatchTxs :
Q extends 'config_backend_version' ? BackendVersionConfig :
Q extends 'addresses_lookup' ? EnsAddressLookupResponse :
Q extends 'domain_info' ? EnsDomainDetailed :
Q extends 'domain_events' ? EnsDomainEventsResponse :
Q extends 'domains_lookup' ? EnsDomainLookupResponse :
Q extends 'user_ops' ? UserOpsResponse :
Q extends 'user_op' ? UserOp :
Q extends 'user_ops_account' ? UserOpsAccount :
never;
// !!! IMPORTANT !!!
// See comment above
/* eslint-enable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/indent */
export type ResourcePayloadB<Q extends ResourceName> =
Q extends 'marketplace_dapps' ? Array<MarketplaceAppOverview> :
Q extends 'marketplace_dapp' ? MarketplaceAppOverview :
Q extends 'validators' ? ValidatorsResponse :
Q extends 'validators_counters' ? ValidatorsCountersResponse :
Q extends 'shibarium_withdrawals' ? ShibariumWithdrawalsResponse :
Q extends 'shibarium_deposits' ? ShibariumDepositsResponse :
Q extends 'shibarium_withdrawals_count' ? number :
Q extends 'shibarium_deposits_count' ? number :
Q extends 'contract_security_audits' ? SmartContractSecurityAudits :
never;
/* eslint-enable @typescript-eslint/indent */

export type ResourcePayload<Q extends ResourceName> = ResourcePayloadA<Q> | ResourcePayloadB<Q>;
export type PaginatedResponseItems<Q extends ResourceName> = Q extends PaginatedResources ? ResourcePayloadA<Q>['items'] | ResourcePayloadB<Q>['items'] : never;
export type PaginatedResponseNextPageParams<Q extends ResourceName> = Q extends PaginatedResources ?
  ResourcePayloadA<Q>['next_page_params'] | ResourcePayloadB<Q>['next_page_params'] :
  never;

/* eslint-disable @typescript-eslint/indent */
export type PaginationFilters<Q extends PaginatedResources> =
Q extends 'blocks' ? BlockFilters :
Q extends 'txs_validated' | 'txs_pending' ? TTxsFilters :
Q extends 'tx_token_transfers' ? TokenTransferFilters :
Q extends 'token_transfers' ? TokenTransferFilters :
Q extends 'address_txs' | 'address_internal_txs' ? AddressTxsFilters :
Q extends 'address_token_transfers' ? AddressTokenTransferFilters :
Q extends 'address_tokens' ? AddressTokensFilter :
Q extends 'address_nfts' ? AddressNFTTokensFilter :
Q extends 'address_collections' ? AddressNFTTokensFilter :
Q extends 'search' ? SearchResultFilters :
Q extends 'token_inventory' ? TokenInventoryFilters :
Q extends 'tokens' ? TokensFilters :
Q extends 'tokens_bridged' ? TokensBridgedFilters :
Q extends 'verified_contracts' ? VerifiedContractsFilters :
Q extends 'addresses_lookup' ? EnsAddressLookupFilters :
Q extends 'domains_lookup' ? EnsDomainLookupFilters :
Q extends 'user_ops' ? UserOpsFilters :
Q extends 'validators' ? ValidatorsFilters :
never;
/* eslint-enable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/indent */
export type PaginationSorting<Q extends PaginatedResources> =
Q extends 'tokens' ? TokensSorting :
Q extends 'tokens_bridged' ? TokensSorting :
Q extends 'verified_contracts' ? VerifiedContractsSorting :
Q extends 'address_txs' ? TransactionsSorting :
Q extends 'addresses_lookup' ? EnsLookupSorting :
Q extends 'domains_lookup' ? EnsLookupSorting :
Q extends 'validators' ? ValidatorsSorting :
never;
/* eslint-enable @typescript-eslint/indent */
