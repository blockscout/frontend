import type { ApiResource } from '../types';
import type { VerifiedAddressResponse } from 'types/api/account';
import type { Pool, PoolsResponse } from 'types/api/pools';
import type { TokenVerifiedInfo } from 'types/api/token';

export const CONTRACT_INFO_API_RESOURCES = {
  address_verification: {
    path: '/api/v1/chains/:instanceId/verified-addresses:type',
    pathParams: [ 'instanceId' as const, 'type' as const ],
  },
  verified_addresses: {
    path: '/api/v1/chains/:instanceId/verified-addresses',
    pathParams: [ 'instanceId' as const ],
  },
  token_verified_info: {
    path: '/api/v1/chains/:instanceId/token-infos/:hash',
    pathParams: [ 'instanceId' as const, 'hash' as const ],
  },
  pools: {
    path: '/api/v1/chains/:instanceId/pools',
    pathParams: [ 'instanceId' as const ],
    filterFields: [ 'query' as const ],
    paginated: true,
  },
  pool: {
    path: '/api/v1/chains/:instanceId/pools/:hash',
    pathParams: [ 'instanceId' as const, 'hash' as const ],
  },
} satisfies Record<string, ApiResource>;

export type ContractInfoApiResourceName = `contractInfo:${ keyof typeof CONTRACT_INFO_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type ContractInfoApiResourcePayload<R extends ContractInfoApiResourceName> =
R extends 'contractInfo:verified_addresses' ? VerifiedAddressResponse :
R extends 'contractInfo:token_verified_info' ? TokenVerifiedInfo :
R extends 'contractInfo:pools' ? PoolsResponse :
R extends 'contractInfo:pool' ? Pool :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type ContractInfoApiPaginationFilters<R extends ContractInfoApiResourceName> =
R extends 'contractInfo:pools' ? { query: string } :
never;
/* eslint-enable @stylistic/indent */
