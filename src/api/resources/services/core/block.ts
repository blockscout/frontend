// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { paths } from '@blockscout/api-types';
import type { TxsWithBlobsFilters } from 'src/features/data-availability/types/api';
import type { BlockCountdownResponse, BlockFilters } from 'src/slices/block/types/api';

export const CORE_API_BLOCK_RESOURCES = {
  blocks: {
    path: '/api/v2/blocks',
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  block: {
    path: '/api/v2/blocks/:height_or_hash',
    pathParams: [ 'height_or_hash' as const ],
  },
  block_txs: {
    path: '/api/v2/blocks/:height_or_hash/transactions',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [ 'type' as const ],
    paginated: true,
  },
  block_internal_txs: {
    path: '/api/v2/blocks/:height_or_hash/internal-transactions',
    pathParams: [ 'height_or_hash' as const ],
    paginated: true,
  },
  block_deposits: {
    path: '/api/v2/blocks/:height_or_hash/beacon/deposits',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
    paginated: true,
  },
  block_withdrawals: {
    path: '/api/v2/blocks/:height_or_hash/withdrawals',
    pathParams: [ 'height_or_hash' as const ],
    filterFields: [],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type CoreApiBlockResourceName = `core:${ keyof typeof CORE_API_BLOCK_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiBlockResourcePayload<R extends CoreApiBlockResourceName> =
R extends 'core:blocks' ? paths['/v2/blocks']['get'] :
R extends 'core:block' ? paths['/v2/blocks/{block_hash_or_number_param}']['get'] :
R extends 'core:block_countdown' ? BlockCountdownResponse :
R extends 'core:block_txs' ? paths['/v2/blocks/{block_hash_or_number_param}/transactions']['get'] :
R extends 'core:block_internal_txs' ? paths['/v2/blocks/{block_hash_or_number_param}/internal-transactions']['get'] :
R extends 'core:block_withdrawals' ? paths['/v2/blocks/{block_hash_or_number_param}/withdrawals']['get'] :
R extends 'core:block_deposits' ? paths['/v2/blocks/{block_hash_or_number_param}/beacon/deposits']['get'] :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiBlockPaginationFilters<R extends CoreApiBlockResourceName> =
R extends 'core:blocks' ? BlockFilters :
R extends 'core:block_txs' ? TxsWithBlobsFilters :
never;
/* eslint-enable @stylistic/indent */
