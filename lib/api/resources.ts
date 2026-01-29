import type { ApiName, ApiResource } from './types';

import type { AdminApiResourceName, AdminApiResourcePayload } from './services/admin';
import { ADMIN_API_RESOURCES } from './services/admin';
import { BENS_API_RESOURCES } from './services/bens';
import type { BensApiResourceName, BensApiResourcePayload, BensApiPaginationFilters, BensApiPaginationSorting } from './services/bens';
import { CLUSTERS_API_RESOURCES } from './services/clusters';
import type { ClustersApiResourceName, ClustersApiResourcePayload, ClustersApiPaginationFilters, ClustersApiPaginationSorting } from './services/clusters';
import { CONTRACT_INFO_API_RESOURCES } from './services/contractInfo';
import type { ContractInfoApiPaginationFilters, ContractInfoApiResourceName, ContractInfoApiResourcePayload } from './services/contractInfo';
import { GENERAL_API_RESOURCES } from './services/general';
import type { GeneralApiResourceName, GeneralApiResourcePayload, GeneralApiPaginationFilters, GeneralApiPaginationSorting } from './services/general';
import type { MetadataApiResourceName, MetadataApiResourcePayload } from './services/metadata';
import { METADATA_API_RESOURCES } from './services/metadata';
import type {
  MultichainAggregatorApiPaginationFilters,
  MultichainAggregatorApiResourceName,
  MultichainAggregatorApiResourcePayload,
} from './services/multichainAggregator';
import { MULTICHAIN_AGGREGATOR_API_RESOURCES } from './services/multichainAggregator';
import type { MultichainStatsApiResourcePayload, MultichainStatsApiResourceName } from './services/multichainStats';
import { MULTICHAIN_STATS_API_RESOURCES } from './services/multichainStats';
import type { RewardsApiResourceName, RewardsApiResourcePayload } from './services/rewards';
import { REWARDS_API_RESOURCES } from './services/rewards';
import type { StatsApiResourceName, StatsApiResourcePayload } from './services/stats';
import { STATS_API_RESOURCES } from './services/stats';
import { TAC_OPERATION_LIFECYCLE_API_RESOURCES } from './services/tac-operation-lifecycle';
import type {
  TacOperationLifecycleApiPaginationFilters,
  TacOperationLifecycleApiResourceName,
  TacOperationLifecycleApiResourcePayload,
} from './services/tac-operation-lifecycle';
import { USER_OPS_API_RESOURCES } from './services/userOps';
import type { IsPaginated } from './services/utils';
import { VISUALIZE_API_RESOURCES } from './services/visualize';
import type { VisualizeApiResourceName, VisualizeApiResourcePayload } from './services/visualize';
import { ZETA_CHAIN_API_RESOURCES } from './services/zetaChain';
import type { ZetaChainApiPaginationFilters, ZetaChainApiResourceName, ZetaChainApiResourcePayload } from './services/zetaChain';

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
    filterFields: [ 'address' as const, 'resolved_to' as const, 'owned_by' as const, 'only_active' as const, 'protocols' as const ],
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
  token_instance_refresh_metadata: {
    path: '/api/v2/tokens/:hash/instances/:id/refetch-metadata',
    pathParams: [ 'hash' as const, 'id' as const ],
    filterFields: [],
  },

  // APP STATS
  stats: {
    path: '/api/v2/stats',
    // headers: {
    //   'updated-gas-oracle': 'true',
    // },
  admin: ADMIN_API_RESOURCES,
  bens: BENS_API_RESOURCES,
  clusters: CLUSTERS_API_RESOURCES,
  contractInfo: CONTRACT_INFO_API_RESOURCES,
  general: GENERAL_API_RESOURCES,
  metadata: METADATA_API_RESOURCES,
  multichainAggregator: MULTICHAIN_AGGREGATOR_API_RESOURCES,
  multichainStats: MULTICHAIN_STATS_API_RESOURCES,
  rewards: REWARDS_API_RESOURCES,
  stats: STATS_API_RESOURCES,
  tac: TAC_OPERATION_LIFECYCLE_API_RESOURCES,
  userOps: USER_OPS_API_RESOURCES,
  visualize: VISUALIZE_API_RESOURCES,
  zetachain: ZETA_CHAIN_API_RESOURCES,
  // external API resources
  // there is no type definition for them, use valibot to parse the response
  external: {
    gas_hawk_saving_potential: {
      path: '/api/v2/gas-hawk-saving-potential',
    },
    safe_transaction_api: {
      path: '',
    },
  },
} satisfies Record<ApiName, Record<string, ApiResource>>;

export const resourceKey = (x: ResourceName) => x;

export type ResourceName = {
  [K in keyof typeof RESOURCES]: `${ K & string }:${ keyof (typeof RESOURCES)[K] & string }`
}[keyof typeof RESOURCES];

export type ResourcePath = string;

/* eslint-disable @stylistic/indent */
export type ResourcePayload<R extends ResourceName> =
R extends AdminApiResourceName ? AdminApiResourcePayload<R> :
R extends BensApiResourceName ? BensApiResourcePayload<R> :
R extends ClustersApiResourceName ? ClustersApiResourcePayload<R> :
R extends ContractInfoApiResourceName ? ContractInfoApiResourcePayload<R> :
R extends GeneralApiResourceName ? GeneralApiResourcePayload<R> :
R extends MetadataApiResourceName ? MetadataApiResourcePayload<R> :
R extends MultichainAggregatorApiResourceName ? MultichainAggregatorApiResourcePayload<R> :
R extends MultichainStatsApiResourceName ? MultichainStatsApiResourcePayload<R> :
R extends RewardsApiResourceName ? RewardsApiResourcePayload<R> :
R extends StatsApiResourceName ? StatsApiResourcePayload<R> :
R extends TacOperationLifecycleApiResourceName ? TacOperationLifecycleApiResourcePayload<R> :
R extends VisualizeApiResourceName ? VisualizeApiResourcePayload<R> :
R extends ZetaChainApiResourceName ? ZetaChainApiResourcePayload<R> :
never;
/* eslint-enable @stylistic/indent */

type ResourcePathParamName<Q extends ResourceName> = Q extends `${ infer A }:${ infer R }` ?
  (typeof RESOURCES)[A & keyof typeof RESOURCES][R & keyof (typeof RESOURCES)[A & keyof typeof RESOURCES]] extends { pathParams: Array<string> } ?
    (typeof RESOURCES)[A & keyof typeof RESOURCES][R & keyof (typeof RESOURCES)[A & keyof typeof RESOURCES]]['pathParams'][number] :
    never :
  never;

export type ResourcePathParams<Q extends ResourceName> = Q extends `${ infer A }:${ infer R }` ?
  (typeof RESOURCES)[A & keyof typeof RESOURCES][R & keyof (typeof RESOURCES)[A & keyof typeof RESOURCES]] extends { pathParams: Array<string> } ?
    Record<ResourcePathParamName<Q>, string | undefined> :
    never :
  never;

export interface ResourceError<T = unknown> {
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

export type ResourceErrorAccount<T> = ResourceError<{ errors: T }>;

// PAGINATION

/* eslint-disable @stylistic/indent */
export type PaginationFilters<R extends ResourceName> =
R extends BensApiResourceName ? BensApiPaginationFilters<R> :
R extends ClustersApiResourceName ? ClustersApiPaginationFilters :
R extends GeneralApiResourceName ? GeneralApiPaginationFilters<R> :
R extends ContractInfoApiResourceName ? ContractInfoApiPaginationFilters<R> :
R extends MultichainAggregatorApiResourceName ? MultichainAggregatorApiPaginationFilters<R> :
R extends TacOperationLifecycleApiResourceName ? TacOperationLifecycleApiPaginationFilters<R> :
R extends ZetaChainApiResourceName ? ZetaChainApiPaginationFilters<R> :
never;
/* eslint-enable @stylistic/indent */

export const SORTING_FIELDS = [ 'sort', 'order' ];

/* eslint-disable @stylistic/indent */
export type PaginationSorting<R extends ResourceName> =
R extends BensApiResourceName ? BensApiPaginationSorting<R> :
R extends ClustersApiResourceName ? ClustersApiPaginationSorting :
R extends GeneralApiResourceName ? GeneralApiPaginationSorting<R> :
never;
/* eslint-enable @stylistic/indent */

export type PaginatedResourceName = {
  [A in keyof typeof RESOURCES]: {
    [R in keyof (typeof RESOURCES)[A]]: (typeof RESOURCES)[A][R] extends ApiResource ?
      IsPaginated<(typeof RESOURCES)[A][R]> extends true ? `${ A & string }:${ R & string }` : never :
      never
  }[keyof (typeof RESOURCES)[A]]
}[keyof typeof RESOURCES];

export type PaginatedResourceResponse<R extends PaginatedResourceName> = ResourcePayload<R>;

export type PaginatedResourceResponseItems<R extends ResourceName> = R extends PaginatedResourceName ?
  ResourcePayload<R>['items'] :
  never;

export type PaginatedResourceResponseNextPageParams<R extends ResourceName> = R extends PaginatedResourceName ?
  ResourcePayload<R>['next_page_params'] :
  never;

// TESTS
export const a: ResourcePayload<'general:api_keys'> = [ {
  api_key: '123',
  name: '123',
} ];

export const b: PaginatedResourceName = 'general:addresses';

export const c: PaginatedResourceResponseItems<'general:addresses'> = [];

export const d: ResourcePathParams<'bens:address_domain'> = {
  chainId: '1',
  address: '123',
};
