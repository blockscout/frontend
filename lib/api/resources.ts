import type { ApiName, ApiResource } from './types';

import type { AdminApiResourceName, AdminApiResourcePayload } from './services/admin';
import { ADMIN_API_RESOURCES } from './services/admin';
import { BENS_API_RESOURCES } from './services/bens';
import type { BensApiResourceName, BensApiResourcePayload, BensApiPaginationFilters, BensApiPaginationSorting } from './services/bens';
import { CONTRACT_INFO_API_RESOURCES } from './services/contractInfo';
import type { ContractInfoApiPaginationFilters, ContractInfoApiResourceName, ContractInfoApiResourcePayload } from './services/contractInfo';
import { GENERAL_API_RESOURCES } from './services/general';
import type { GeneralApiResourceName, GeneralApiResourcePayload, GeneralApiPaginationFilters, GeneralApiPaginationSorting } from './services/general';
import type { MetadataApiResourceName, MetadataApiResourcePayload } from './services/metadata';
import { METADATA_API_RESOURCES } from './services/metadata';
import type { MultichainApiResourceName, MultichainApiResourcePayload } from './services/multichain';
import { MULTICHAIN_API_RESOURCES } from './services/multichain';
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
import type { IsPaginated } from './services/utils';
import { VISUALIZE_API_RESOURCES } from './services/visualize';
import type { VisualizeApiResourceName, VisualizeApiResourcePayload } from './services/visualize';

export const RESOURCES = {
  admin: ADMIN_API_RESOURCES,
  bens: BENS_API_RESOURCES,
  contractInfo: CONTRACT_INFO_API_RESOURCES,
  general: GENERAL_API_RESOURCES,
  metadata: METADATA_API_RESOURCES,
  multichain: MULTICHAIN_API_RESOURCES,
  rewards: REWARDS_API_RESOURCES,
  stats: STATS_API_RESOURCES,
  tac: TAC_OPERATION_LIFECYCLE_API_RESOURCES,
  visualize: VISUALIZE_API_RESOURCES,
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
R extends ContractInfoApiResourceName ? ContractInfoApiResourcePayload<R> :
R extends GeneralApiResourceName ? GeneralApiResourcePayload<R> :
R extends MetadataApiResourceName ? MetadataApiResourcePayload<R> :
R extends MultichainApiResourceName ? MultichainApiResourcePayload<R> :
R extends RewardsApiResourceName ? RewardsApiResourcePayload<R> :
R extends StatsApiResourceName ? StatsApiResourcePayload<R> :
R extends TacOperationLifecycleApiResourceName ? TacOperationLifecycleApiResourcePayload<R> :
R extends VisualizeApiResourceName ? VisualizeApiResourcePayload<R> :
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
R extends GeneralApiResourceName ? GeneralApiPaginationFilters<R> :
R extends ContractInfoApiResourceName ? ContractInfoApiPaginationFilters<R> :
R extends TacOperationLifecycleApiResourceName ? TacOperationLifecycleApiPaginationFilters<R> :
never;
/* eslint-enable @stylistic/indent */

export const SORTING_FIELDS = [ 'sort', 'order' ];

/* eslint-disable @stylistic/indent */
export type PaginationSorting<R extends ResourceName> =
R extends BensApiResourceName ? BensApiPaginationSorting<R> :
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
