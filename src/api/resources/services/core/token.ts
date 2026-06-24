// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { paths } from '@blockscout/api-types';
import type { TokenTransferFilters } from 'src/slices/token-transfer/types/api';
import type {
  TokenInventoryFilters,
  TokensFilters,
  TokensSorting,
  TokensBridgedFilters,
} from 'src/slices/token/types/api';

export const CORE_API_TOKEN_RESOURCES = {
  // TOKEN
  token: {
    path: '/api/v2/tokens/:hash',
    pathParams: [ 'hash' as const ],
  },
  token_counters: {
    path: '/api/v2/tokens/:hash/counters',
    pathParams: [ 'hash' as const ],
  },
  token_holders: {
    path: '/api/v2/tokens/:hash/holders',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  token_transfers: {
    path: '/api/v2/tokens/:hash/transfers',
    pathParams: [ 'hash' as const ],
    filterFields: [],
    paginated: true,
  },
  token_inventory: {
    path: '/api/v2/tokens/:hash/instances',
    pathParams: [ 'hash' as const ],
    filterFields: [ 'holder_address_hash' as const ],
    paginated: true,
  },
  tokens: {
    path: '/api/v2/tokens',
    filterFields: [ 'q' as const, 'type' as const ],
    paginated: true,
  },
  tokens_bridged: {
    path: '/api/v2/tokens/bridged',
    filterFields: [ 'q' as const, 'chain_ids' as const ],
    paginated: true,
  },
  token_csv_export_holders: {
    path: '/api/v2/tokens/:hash/holders/csv',
    pathParams: [ 'hash' as const ],
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
    paginated: true,
  },
  token_instance_holders: {
    path: '/api/v2/tokens/:hash/instances/:id/holders',
    pathParams: [ 'hash' as const, 'id' as const ],
    filterFields: [],
    paginated: true,
  },
  token_instance_refresh_metadata: {
    path: '/api/v2/tokens/:hash/instances/:id/refetch-metadata',
    pathParams: [ 'hash' as const, 'id' as const ],
    filterFields: [],
  },

  // TOKEN TRANSFERS
  token_transfers_all: {
    path: '/api/v2/token-transfers',
    filterFields: [ 'type' as const ],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type CoreApiTokenResourceName = `core:${ keyof typeof CORE_API_TOKEN_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiTokenResourcePayload<R extends CoreApiTokenResourceName> =
R extends 'core:token' ? paths['/v2/tokens/{address_hash_param}']['get'] :
R extends 'core:token_counters' ? paths['/v2/tokens/{address_hash_param}/counters']['get'] :
R extends 'core:token_transfers' ? paths['/v2/tokens/{address_hash_param}/transfers']['get'] :
R extends 'core:token_holders' ? paths['/v2/tokens/{address_hash_param}/holders']['get'] :
R extends 'core:token_instance' ? paths['/v2/tokens/{address_hash_param}/instances/{token_id_param}']['get'] :
R extends 'core:token_instance_transfers_count' ? paths['/v2/tokens/{address_hash_param}/instances/{token_id_param}/transfers-count']['get'] :
R extends 'core:token_instance_transfers' ? paths['/v2/tokens/{address_hash_param}/instances/{token_id_param}/transfers']['get'] :
R extends 'core:token_instance_holders' ? paths['/v2/tokens/{address_hash_param}/instances/{token_id_param}/holders']['get'] :
R extends 'core:token_inventory' ? paths['/v2/tokens/{address_hash_param}/instances']['get'] :
R extends 'core:tokens' ? paths['/v2/tokens/']['get'] :
R extends 'core:tokens_bridged' ? paths['/v2/tokens/bridged']['get'] :
R extends 'core:token_transfers_all' ? paths['/v2/token-transfers']['get'] :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiTokenPaginationFilters<R extends CoreApiTokenResourceName> =
R extends 'core:token_transfers' ? TokenTransferFilters :
R extends 'core:token_inventory' ? TokenInventoryFilters :
R extends 'core:tokens' ? TokensFilters :
R extends 'core:tokens_bridged' ? TokensBridgedFilters :
R extends 'core:token_transfers_all' ? TokenTransferFilters :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiTokenPaginationSorting<R extends CoreApiTokenResourceName> =
R extends 'core:tokens' ? TokensSorting :
R extends 'core:tokens_bridged' ? TokensSorting :
never;
/* eslint-enable @stylistic/indent */
