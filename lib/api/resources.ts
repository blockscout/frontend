import type * as bens from '@blockscout/bens-types';
import type * as stats from '@blockscout/stats-types';
import type * as visualizer from '@blockscout/visualizer-types';
import { getFeaturePayload } from 'configs/app/features/types';
import type {
  UserInfo,
  CustomAbis,
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
  AddressMudTables,
  AddressMudTablesFilter,
  AddressMudRecords,
  AddressMudRecordsFilter,
  AddressMudRecordsSorting,
  AddressMudRecord,
} from 'types/api/address';
import type { AddressesResponse, AddressesMetadataSearchResult, AddressesMetadataSearchFilters } from 'types/api/addresses';
import type { AddressMetadataInfo, PublicTagTypesResponse } from 'types/api/addressMetadata';
import type {
  ArbitrumL2MessagesResponse,
  ArbitrumL2TxnBatch,
  ArbitrumL2TxnBatchesResponse,
  ArbitrumL2BatchTxs,
  ArbitrumL2BatchBlocks,
  ArbitrumL2TxnBatchesItem,
  ArbitrumLatestDepositsResponse,
} from 'types/api/arbitrumL2';
import type { TxBlobs, Blob } from 'types/api/blobs';
import type {
  BlocksResponse,
  BlockTransactionsResponse,
  Block,
  BlockFilters,
  BlockWithdrawalsResponse,
  BlockCountdownResponse,
  BlockEpoch,
  BlockEpochElectionRewardDetailsResponse,
} from 'types/api/block';
import type { ChartMarketResponse, ChartSecondaryCoinPriceResponse, ChartTransactionResponse } from 'types/api/charts';
import type { BackendVersionConfig, CsvExportConfig } from 'types/api/configs';
import type {
  SmartContract,
  SmartContractVerificationConfigRaw,
  SmartContractSecurityAudits,
} from 'types/api/contract';
import type { VerifiedContractsResponse, VerifiedContractsFilters, VerifiedContractsCounters } from 'types/api/contracts';
import type {
  EnsAddressLookupFilters,
  EnsDomainLookupFilters,
  EnsLookupSorting,
} from 'types/api/ens';
import type { IndexingStatus } from 'types/api/indexingStatus';
import type { InternalTransactionsResponse } from 'types/api/internalTransaction';
import type { LogsResponseTx, LogsResponseAddress } from 'types/api/log';
import type { MudWorldsResponse } from 'types/api/mudWorlds';
import type { NovesAccountHistoryResponse, NovesDescribeTxsResponse, NovesResponseData } from 'types/api/noves';
import type {
  OptimisticL2DepositsResponse,
  OptimisticL2DepositsItem,
  OptimisticL2OutputRootsResponse,
  OptimisticL2TxnBatchesResponse,
  OptimisticL2WithdrawalsResponse,
  OptimisticL2DisputeGamesResponse,
  OptimismL2TxnBatch,
  OptimismL2BatchTxs,
  OptimismL2BatchBlocks,
} from 'types/api/optimisticL2';
import type { RawTracesResponse } from 'types/api/rawTrace';
import type { SearchRedirectResult, SearchResult, SearchResultFilters, SearchResultItem } from 'types/api/search';
import type { ShibariumWithdrawalsResponse, ShibariumDepositsResponse } from 'types/api/shibarium';
import type { HomeStats } from 'types/api/stats';
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
  TransactionsResponseWithBlobs,
  TransactionsStats,
} from 'types/api/transaction';
import type { TxInterpretationResponse } from 'types/api/txInterpretation';
import type { TTxsFilters, TTxsWithBlobsFilters } from 'types/api/txsFilters';
import type { TxStateChanges } from 'types/api/txStateChanges';
import type { UserOpsResponse, UserOp, UserOpsFilters, UserOpsAccount } from 'types/api/userOps';
import type {
  ValidatorsStabilityCountersResponse,
  ValidatorsStabilityFilters,
  ValidatorsStabilityResponse,
  ValidatorsStabilitySorting,
  ValidatorsBlackfortCountersResponse,
  ValidatorsBlackfortResponse,
  ValidatorsBlackfortSorting,
} from 'types/api/validators';
import type { VerifiedContractsSorting } from 'types/api/verifiedContracts';
import type { WithdrawalsResponse, WithdrawalsCounters } from 'types/api/withdrawals';
import type {
  ZkEvmL2DepositsResponse,
  ZkEvmL2TxnBatch,
  ZkEvmL2TxnBatchesItem,
  ZkEvmL2TxnBatchesResponse,
  ZkEvmL2TxnBatchTxs,
  ZkEvmL2WithdrawalsResponse,
} from 'types/api/zkEvmL2';
import type { ZkSyncBatch, ZkSyncBatchesResponse, ZkSyncBatchTxs } from 'types/api/zkSyncL2';
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
    path: '/api/account/v2/user/custom_abis{/:id}',
    pathParams: [ 'id' as const ],
  },
  watchlist: {
    path: '/api/account/v2/user/watchlist{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  private_tags_address: {
    path: '/api/account/v2/user/tags/address{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  private_tags_tx: {
    path: '/api/account/v2/user/tags/transaction{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
  },
  api_keys: {
    path: '/api/account/v2/user/api_keys{/:id}',
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
    path: '/api/v1/chains/:chainId/token-info-submissions{/:id}',
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
    filterFields: [ 'address' as const, 'resolved_to' as const, 'owned_by' as const, 'only_active' as const, 'protocols' as const ],
  },
  address_domain: {
    path: '/api/v1/:chainId/addresses/:address',
    pathParams: [ 'chainId' as const, 'address' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
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
    filterFields: [ 'name' as const, 'only_active' as const, 'protocols' as const ],
  },
  domain_protocols: {
    path: '/api/v1/:chainId/protocols',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.nameService)?.api.endpoint,
    basePath: getFeaturePayload(config.features.nameService)?.api.basePath,
  },

  // METADATA SERVICE & PUBLIC TAGS
  address_metadata_info: {
    path: '/api/v1/metadata',
    endpoint: getFeaturePayload(config.features.addressMetadata)?.api.endpoint,
    basePath: getFeaturePayload(config.features.addressMetadata)?.api.basePath,
  },
  address_metadata_tag_search: {
    path: '/api/v1/tags:search',
    endpoint: getFeaturePayload(config.features.addressMetadata)?.api.endpoint,
    basePath: getFeaturePayload(config.features.addressMetadata)?.api.basePath,
  },
  address_metadata_tag_types: {
    path: '/api/v1/public-tag-types',
    endpoint: getFeaturePayload(config.features.addressMetadata)?.api.endpoint,
    basePath: getFeaturePayload(config.features.addressMetadata)?.api.basePath,
  },
  public_tag_application: {
    path: '/api/v1/chains/:chainId/metadata-submissions/tag',
    pathParams: [ 'chainId' as const ],
    endpoint: getFeaturePayload(config.features.publicTagsSubmission)?.api.endpoint,
    basePath: getFeaturePayload(config.features.publicTagsSubmission)?.api.basePath,
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
    filterFields: [ 'type' as const ],
  },
  block_withdrawals: {
    path: '/api/v2/blocks/:height_or_hash/withdrawals',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
  },
  block_epoch: {
    path: '/api/v2/blocks/:height_or_hash/epoch',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
  },
  block_election_rewards: {
    path: '/api/v2/blocks/:height_or_hash/election-rewards/:reward_type',
    pathParams: [ 'height_or_hash' as const, 'reward_type' as const ],
    filterFields: [],
  },
  txs_stats: {
    path: '/api/v2/transactions/stats',
  },
  txs_validated: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  txs_pending: {
    path: '/api/v2/transactions',
    filterFields: [ 'filter' as const, 'type' as const, 'method' as const ],
  },
  txs_with_blobs: {
    path: '/api/v2/transactions',
    filterFields: [ 'type' as const ],
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
  tx_blobs: {
    path: '/api/v2/transactions/:hash/blobs',
    pathParams: [ 'hash' as const ],
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
  addresses_metadata_search: {
    path: '/api/v2/proxy/metadata/addresses',
    filterFields: [ 'slug' as const, 'tag_type' as const ],
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
  contract_verification_config: {
    path: '/api/v2/smart-contracts/verification/config',
  },
  contract_verification_via: {
    path: '/api/v2/smart-contracts/:hash/verification/via/:method',
    pathParams: [ 'hash' as const, 'method' as const ],
  },
  contract_solidity_scan_report: {
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
  token_instance_refresh_metadata: {
    path: '/api/v2/tokens/:hash/instances/:id/refetch-metadata',
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
  stats_charts_secondary_coin_price: {
    path: '/api/v2/stats/charts/secondary-coin-market',
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
  homepage_zkevm_l2_batches: {
    path: '/api/v2/main-page/zkevm/batches/confirmed',
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
  homepage_zkevm_latest_batch: {
    path: '/api/v2/main-page/zkevm/batches/latest-number',
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
  },
  search_check_redirect: {
    path: '/api/v2/search/check-redirect',
  },

  // optimistic L2
  optimistic_l2_deposits: {
    path: '/api/v2/optimism/deposits',
    filterFields: [],
  },

  optimistic_l2_deposits_count: {
    path: '/api/v2/optimism/deposits/count',
  },

  optimistic_l2_withdrawals: {
    path: '/api/v2/optimism/withdrawals',
    filterFields: [],
  },

  optimistic_l2_withdrawals_count: {
    path: '/api/v2/optimism/withdrawals/count',
  },

  optimistic_l2_output_roots: {
    path: '/api/v2/optimism/output-roots',
    filterFields: [],
  },

  optimistic_l2_output_roots_count: {
    path: '/api/v2/optimism/output-roots/count',
  },

  optimistic_l2_txn_batches: {
    path: '/api/v2/optimism/batches',
    filterFields: [],
  },

  optimistic_l2_txn_batches_count: {
    path: '/api/v2/optimism/batches/count',
  },

  optimistic_l2_txn_batch: {
    path: '/api/v2/optimism/batches/:number',
    pathParams: [ 'number' as const ],
  },

  optimistic_l2_txn_batch_txs: {
    path: '/api/v2/transactions/optimism-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
  },

  optimistic_l2_txn_batch_blocks: {
    path: '/api/v2/blocks/optimism-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
  },

  optimistic_l2_dispute_games: {
    path: '/api/v2/optimism/games',
    filterFields: [],
  },

  optimistic_l2_dispute_games_count: {
    path: '/api/v2/optimism/games/count',
  },

  // MUD worlds on optimism
  mud_worlds: {
    path: '/api/v2/mud/worlds',
    filterFields: [],
  },

  address_mud_tables: {
    path: '/api/v2/mud/worlds/:hash/tables',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'q' as const ],
  },

  address_mud_tables_count: {
    path: '/api/v2/mud/worlds/:hash/tables/count',
    pathParams: [ 'hash' as const ],
  },

  address_mud_records: {
    path: '/api/v2/mud/worlds/:hash/tables/:table_id/records',
    pathParams: [ 'hash' as const, 'table_id' as const ],
    filterFields: [ 'filter_key0' as const, 'filter_key1' as const ],
  },

  address_mud_record: {
    path: '/api/v2/mud/worlds/:hash/tables/:table_id/records/:record_id',
    pathParams: [ 'hash' as const, 'table_id' as const, 'record_id' as const ],
  },

  // arbitrum L2
  arbitrum_l2_messages: {
    path: '/api/v2/arbitrum/messages/:direction',
    pathParams: [ 'direction' as const ],
    filterFields: [],
  },

  arbitrum_l2_messages_count: {
    path: '/api/v2/arbitrum/messages/:direction/count',
    pathParams: [ 'direction' as const ],
  },

  arbitrum_l2_txn_batches: {
    path: '/api/v2/arbitrum/batches',
    filterFields: [],
  },

  arbitrum_l2_txn_batches_count: {
    path: '/api/v2/arbitrum/batches/count',
  },

  arbitrum_l2_txn_batch: {
    path: '/api/v2/arbitrum/batches/:number',
    pathParams: [ 'number' as const ],
  },

  arbitrum_l2_txn_batch_txs: {
    path: '/api/v2/transactions/arbitrum-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
  },

  arbitrum_l2_txn_batch_blocks: {
    path: '/api/v2/blocks/arbitrum-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
  },

  // zkEvm L2
  zkevm_l2_deposits: {
    path: '/api/v2/zkevm/deposits',
    filterFields: [],
  },

  zkevm_l2_deposits_count: {
    path: '/api/v2/zkevm/deposits/count',
  },

  zkevm_l2_withdrawals: {
    path: '/api/v2/zkevm/withdrawals',
    filterFields: [],
  },

  zkevm_l2_withdrawals_count: {
    path: '/api/v2/zkevm/withdrawals/count',
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

  // zkSync L2
  zksync_l2_txn_batches: {
    path: '/api/v2/zksync/batches',
    filterFields: [],
  },

  zksync_l2_txn_batches_count: {
    path: '/api/v2/zksync/batches/count',
  },

  zksync_l2_txn_batch: {
    path: '/api/v2/zksync/batches/:number',
    pathParams: [ 'number' as const ],
  },

  zksync_l2_txn_batch_txs: {
    path: '/api/v2/transactions/zksync-batch/:number',
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

  // NOVES-FI
  noves_transaction: {
    path: '/api/v2/proxy/noves-fi/transactions/:hash',
    pathParams: [ 'hash' as const ],
  },
  noves_address_history: {
    path: '/api/v2/proxy/noves-fi/addresses/:address/transactions',
    pathParams: [ 'address' as const ],
    filterFields: [],
  },
  noves_describe_txs: {
    path: '/api/v2/proxy/noves-fi/transaction-descriptions',
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
  user_op_interpretation: {
    path: '/api/v2/proxy/account-abstraction/operations/:hash/summary',
    pathParams: [ 'hash' as const ],
  },

  // VALIDATORS
  validators_stability: {
    path: '/api/v2/validators/stability',
    filterFields: [ 'address_hash' as const, 'state_filter' as const ],
  },
  validators_stability_counters: {
    path: '/api/v2/validators/stability/counters',
  },
  validators_blackfort: {
    path: '/api/v2/validators/blackfort',
    filterFields: [],
  },
  validators_blackfort_counters: {
    path: '/api/v2/validators/blackfort/counters',
  },

  // BLOBS
  blob: {
    path: '/api/v2/blobs/:hash',
    pathParams: [ 'hash' as const ],
  },

  // CONFIGS
  config_backend_version: {
    path: '/api/v2/config/backend-version',
  },
  config_csv_export: {
    path: '/api/v2/config/csv-export',
  },

  // CSV EXPORT
  csv_export_token_holders: {
    path: '/api/v2/tokens/:hash/holders/csv',
    pathParams: [ 'hash' as const ],
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
  block_countdown: {
    path: '/api',
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

export type PaginatedResources = 'blocks' | 'block_txs' | 'block_election_rewards' |
'txs_validated' | 'txs_pending' | 'txs_with_blobs' | 'txs_watchlist' | 'txs_execution_node' |
'tx_internal_txs' | 'tx_logs' | 'tx_token_transfers' | 'tx_state_changes' | 'tx_blobs' |
'addresses' | 'addresses_metadata_search' |
'address_txs' | 'address_internal_txs' | 'address_token_transfers' | 'address_blocks_validated' | 'address_coin_balance' |
'search' |
'address_logs' | 'address_tokens' | 'address_nfts' | 'address_collections' |
'token_transfers' | 'token_holders' | 'token_inventory' | 'tokens' | 'tokens_bridged' |
'token_instance_transfers' | 'token_instance_holders' |
'verified_contracts' |
'optimistic_l2_output_roots' | 'optimistic_l2_withdrawals' | 'optimistic_l2_txn_batches' | 'optimistic_l2_deposits' |
'optimistic_l2_dispute_games' | 'optimistic_l2_txn_batch_txs' | 'optimistic_l2_txn_batch_blocks' |
'mud_worlds'| 'address_mud_tables' | 'address_mud_records' |
'shibarium_deposits' | 'shibarium_withdrawals' |
'arbitrum_l2_messages' | 'arbitrum_l2_txn_batches' | 'arbitrum_l2_txn_batch_txs' | 'arbitrum_l2_txn_batch_blocks' |
'zkevm_l2_deposits' | 'zkevm_l2_withdrawals' | 'zkevm_l2_txn_batches' | 'zkevm_l2_txn_batch_txs' |
'zksync_l2_txn_batches' | 'zksync_l2_txn_batch_txs' |
'withdrawals' | 'address_withdrawals' | 'block_withdrawals' |
'watchlist' | 'private_tags_address' | 'private_tags_tx' |
'domains_lookup' | 'addresses_lookup' | 'user_ops' | 'validators_stability' | 'validators_blackfort' | 'noves_address_history';

export type PaginatedResponse<Q extends PaginatedResources> = ResourcePayload<Q>;

/* eslint-disable @typescript-eslint/indent */
// !!! IMPORTANT !!!
// Don't add any new types here because TypeScript cannot handle it properly
// use ResourcePayloadB instead
export type ResourcePayloadA<Q extends ResourceName> =
Q extends 'user_info' ? UserInfo :
Q extends 'custom_abi' ? CustomAbis :
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
Q extends 'stats_charts_secondary_coin_price' ? ChartSecondaryCoinPriceResponse :
Q extends 'homepage_blocks' ? Array<Block> :
Q extends 'homepage_txs' ? Array<Transaction> :
Q extends 'homepage_txs_watchlist' ? Array<Transaction> :
Q extends 'homepage_optimistic_deposits' ? Array<OptimisticL2DepositsItem> :
Q extends 'homepage_arbitrum_deposits' ? ArbitrumLatestDepositsResponse :
Q extends 'homepage_zkevm_l2_batches' ? { items: Array<ZkEvmL2TxnBatchesItem> } :
Q extends 'homepage_arbitrum_l2_batches' ? { items: Array<ArbitrumL2TxnBatchesItem>} :
Q extends 'homepage_indexing_status' ? IndexingStatus :
Q extends 'homepage_zkevm_latest_batch' ? number :
Q extends 'homepage_zksync_latest_batch' ? number :
Q extends 'homepage_arbitrum_latest_batch' ? number :
Q extends 'stats_counters' ? stats.Counters :
Q extends 'stats_lines' ? stats.LineCharts :
Q extends 'stats_line' ? stats.LineChart :
Q extends 'blocks' ? BlocksResponse :
Q extends 'block' ? Block :
Q extends 'block_countdown' ? BlockCountdownResponse :
Q extends 'block_txs' ? BlockTransactionsResponse :
Q extends 'block_withdrawals' ? BlockWithdrawalsResponse :
Q extends 'block_epoch' ? BlockEpoch :
Q extends 'block_election_rewards' ? BlockEpochElectionRewardDetailsResponse :
Q extends 'txs_stats' ? TransactionsStats :
Q extends 'txs_validated' ? TransactionsResponseValidated :
Q extends 'txs_pending' ? TransactionsResponsePending :
Q extends 'txs_with_blobs' ? TransactionsResponseWithBlobs :
Q extends 'txs_watchlist' ? TransactionsResponseWatchlist :
Q extends 'txs_execution_node' ? TransactionsResponseValidated :
Q extends 'tx' ? Transaction :
Q extends 'tx_internal_txs' ? InternalTransactionsResponse :
Q extends 'tx_logs' ? LogsResponseTx :
Q extends 'tx_token_transfers' ? TokenTransferResponse :
Q extends 'tx_raw_trace' ? RawTracesResponse :
Q extends 'tx_state_changes' ? TxStateChanges :
Q extends 'tx_blobs' ? TxBlobs :
Q extends 'tx_interpretation' ? TxInterpretationResponse :
Q extends 'addresses' ? AddressesResponse :
Q extends 'addresses_metadata_search' ? AddressesMetadataSearchResult :
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
Q extends 'contract_solidity_scan_report' ? unknown :
Q extends 'verified_contracts' ? VerifiedContractsResponse :
Q extends 'verified_contracts_counters' ? VerifiedContractsCounters :
Q extends 'visualize_sol2uml' ? visualizer.VisualizeResponse :
Q extends 'contract_verification_config' ? SmartContractVerificationConfigRaw :
Q extends 'optimistic_l2_output_roots' ? OptimisticL2OutputRootsResponse :
Q extends 'optimistic_l2_withdrawals' ? OptimisticL2WithdrawalsResponse :
Q extends 'optimistic_l2_deposits' ? OptimisticL2DepositsResponse :
Q extends 'optimistic_l2_txn_batches' ? OptimisticL2TxnBatchesResponse :
Q extends 'optimistic_l2_txn_batches_count' ? number :
Q extends 'optimistic_l2_txn_batch' ? OptimismL2TxnBatch :
Q extends 'optimistic_l2_txn_batch_txs' ? OptimismL2BatchTxs :
Q extends 'optimistic_l2_txn_batch_blocks' ? OptimismL2BatchBlocks :
Q extends 'optimistic_l2_dispute_games' ? OptimisticL2DisputeGamesResponse :
Q extends 'optimistic_l2_output_roots_count' ? number :
Q extends 'optimistic_l2_withdrawals_count' ? number :
Q extends 'optimistic_l2_deposits_count' ? number :
Q extends 'optimistic_l2_dispute_games_count' ? number :
never;
// !!! IMPORTANT !!!
// See comment above
/* eslint-enable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/indent */
export type ResourcePayloadB<Q extends ResourceName> =
Q extends 'config_backend_version' ? BackendVersionConfig :
Q extends 'config_csv_export' ? CsvExportConfig :
Q extends 'address_metadata_info' ? AddressMetadataInfo :
Q extends 'address_metadata_tag_types' ? PublicTagTypesResponse :
Q extends 'blob' ? Blob :
Q extends 'marketplace_dapps' ? Array<MarketplaceAppOverview> :
Q extends 'marketplace_dapp' ? MarketplaceAppOverview :
Q extends 'validators_stability' ? ValidatorsStabilityResponse :
Q extends 'validators_stability_counters' ? ValidatorsStabilityCountersResponse :
Q extends 'validators_blackfort' ? ValidatorsBlackfortResponse :
Q extends 'validators_blackfort_counters' ? ValidatorsBlackfortCountersResponse :
Q extends 'shibarium_withdrawals' ? ShibariumWithdrawalsResponse :
Q extends 'shibarium_deposits' ? ShibariumDepositsResponse :
Q extends 'shibarium_withdrawals_count' ? number :
Q extends 'shibarium_deposits_count' ? number :
Q extends 'arbitrum_l2_messages' ? ArbitrumL2MessagesResponse :
Q extends 'arbitrum_l2_messages_count' ? number :
Q extends 'arbitrum_l2_txn_batches' ? ArbitrumL2TxnBatchesResponse :
Q extends 'arbitrum_l2_txn_batches_count' ? number :
Q extends 'arbitrum_l2_txn_batch' ? ArbitrumL2TxnBatch :
Q extends 'arbitrum_l2_txn_batch_txs' ? ArbitrumL2BatchTxs :
Q extends 'arbitrum_l2_txn_batch_blocks' ? ArbitrumL2BatchBlocks :
Q extends 'zkevm_l2_deposits' ? ZkEvmL2DepositsResponse :
Q extends 'zkevm_l2_deposits_count' ? number :
Q extends 'zkevm_l2_withdrawals' ? ZkEvmL2WithdrawalsResponse :
Q extends 'zkevm_l2_withdrawals_count' ? number :
Q extends 'zkevm_l2_txn_batches' ? ZkEvmL2TxnBatchesResponse :
Q extends 'zkevm_l2_txn_batches_count' ? number :
Q extends 'zkevm_l2_txn_batch' ? ZkEvmL2TxnBatch :
Q extends 'zkevm_l2_txn_batch_txs' ? ZkEvmL2TxnBatchTxs :
Q extends 'zksync_l2_txn_batches' ? ZkSyncBatchesResponse :
Q extends 'zksync_l2_txn_batches_count' ? number :
Q extends 'zksync_l2_txn_batch' ? ZkSyncBatch :
Q extends 'zksync_l2_txn_batch_txs' ? ZkSyncBatchTxs :
Q extends 'contract_security_audits' ? SmartContractSecurityAudits :
Q extends 'addresses_lookup' ? bens.LookupAddressResponse :
Q extends 'address_domain' ? bens.GetAddressResponse :
Q extends 'domain_info' ? bens.DetailedDomain :
Q extends 'domain_events' ? bens.ListDomainEventsResponse :
Q extends 'domains_lookup' ? bens.LookupDomainNameResponse :
Q extends 'domain_protocols' ? bens.GetProtocolsResponse :
Q extends 'user_ops' ? UserOpsResponse :
Q extends 'user_op' ? UserOp :
Q extends 'user_ops_account' ? UserOpsAccount :
Q extends 'user_op_interpretation'? TxInterpretationResponse :
Q extends 'noves_transaction' ? NovesResponseData :
Q extends 'noves_address_history' ? NovesAccountHistoryResponse :
Q extends 'noves_describe_txs' ? NovesDescribeTxsResponse :
Q extends 'mud_worlds' ? MudWorldsResponse :
Q extends 'address_mud_tables' ? AddressMudTables :
Q extends 'address_mud_tables_count' ? number :
Q extends 'address_mud_records' ? AddressMudRecords :
Q extends 'address_mud_record' ? AddressMudRecord :
Q extends 'withdrawals' ? WithdrawalsResponse :
Q extends 'withdrawals_counters' ? WithdrawalsCounters :
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
Q extends 'block_txs' ? TTxsWithBlobsFilters :
Q extends 'txs_validated' | 'txs_pending' ? TTxsFilters :
Q extends 'txs_with_blobs' ? TTxsWithBlobsFilters :
Q extends 'tx_token_transfers' ? TokenTransferFilters :
Q extends 'token_transfers' ? TokenTransferFilters :
Q extends 'address_txs' | 'address_internal_txs' ? AddressTxsFilters :
Q extends 'addresses_metadata_search' ? AddressesMetadataSearchFilters :
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
Q extends 'validators_stability' ? ValidatorsStabilityFilters :
Q extends 'address_mud_tables' ? AddressMudTablesFilter :
Q extends 'address_mud_records' ? AddressMudRecordsFilter :
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
Q extends 'validators_stability' ? ValidatorsStabilitySorting :
Q extends 'validators_blackfort' ? ValidatorsBlackfortSorting :
Q extends 'address_mud_records' ? AddressMudRecordsSorting :
never;
/* eslint-enable @typescript-eslint/indent */
