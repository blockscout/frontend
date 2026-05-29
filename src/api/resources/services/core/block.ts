// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { DepositsResponse } from 'src/features/chain-variants/beacon-chain/types/api';
import type { TxsWithBlobsFilters } from 'src/features/data-availability/types/api';
import type {
  BlocksResponse,
  BlockTransactionsResponse,
  Block,
  BlockFilters,
  BlockWithdrawalsResponse,
  BlockCountdownResponse,
  BlockInternalTransactionsResponse,
} from 'src/slices/block/types/api';

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
R extends 'core:blocks' ? BlocksResponse :
R extends 'core:block' ? Block :
R extends 'core:block_countdown' ? BlockCountdownResponse :
R extends 'core:block_txs' ? BlockTransactionsResponse :
R extends 'core:block_internal_txs' ? BlockInternalTransactionsResponse :
R extends 'core:block_withdrawals' ? BlockWithdrawalsResponse :
R extends 'core:block_deposits' ? DepositsResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiBlockPaginationFilters<R extends CoreApiBlockResourceName> =
R extends 'core:blocks' ? BlockFilters :
R extends 'core:block_txs' ? TxsWithBlobsFilters :
never;
/* eslint-enable @stylistic/indent */
