import type { ApiResource } from '../types';
import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { AddressTokensResponse, TokensResponse } from 'types/client/multichain-aggregator';

export const MULTICHAIN_AGGREGATOR_API_RESOURCES = {
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
  tokens: {
    path: '/tokens',
    filterFields: [ 'chain_id' as const, 'type' as const ],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type MultichainAggregatorApiResourceName = `multichainAggregator:${ keyof typeof MULTICHAIN_AGGREGATOR_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type MultichainAggregatorApiResourcePayload<R extends MultichainAggregatorApiResourceName> =
R extends 'multichainAggregator:address' ? multichain.GetAddressResponse :
R extends 'multichainAggregator:address_tokens' ? AddressTokensResponse :
R extends 'multichainAggregator:tokens' ? TokensResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type MultichainAggregatorApiPaginationFilters<R extends MultichainAggregatorApiResourceName> =
R extends 'multichainAggregator:address_tokens' ? Partial<multichain.ListAddressTokensRequest> :
R extends 'multichainAggregator:tokens' ? Partial<multichain.ListClusterTokensRequest> :
never;
/* eslint-enable @stylistic/indent */
