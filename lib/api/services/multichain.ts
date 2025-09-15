import type { ApiResource } from '../types';
import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { AddressTokensResponse } from 'types/client/multichain-aggregator';

export const MULTICHAIN_API_RESOURCES = {
  address: {
    path: '/addresses/:hash',
    pathParams: [ 'hash' as const ],
  },
  address_tokens: {
    path: '/addresses/:hash/tokens',
    pathParams: [ 'hash' as const ],
    paginated: true,
    filterFields: [ 'chain_id' as const, 'type' as const ],
  },
} satisfies Record<string, ApiResource>;

export type MultichainApiResourceName = `multichain:${ keyof typeof MULTICHAIN_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type MultichainApiResourcePayload<R extends MultichainApiResourceName> =
R extends 'multichain:address' ? multichain.GetAddressResponse :
R extends 'multichain:address_tokens' ? AddressTokensResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type MultichainApiPaginationFilters<R extends MultichainApiResourceName> =
R extends 'multichain:address_tokens' ? Partial<multichain.ListAddressTokensRequest> :
never;
/* eslint-enable @stylistic/indent */
