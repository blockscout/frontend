// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { paths } from '@blockscout/api-types';
import type {
  InteropMessageListResponse } from 'src/features/op-interop/types/api';
import type {
  ArbitrumL2MessagesResponse,
  ArbitrumL2TxnBatch,
  ArbitrumL2TxnBatchesResponse,
  ArbitrumL2TxnWithdrawalsResponse,
  ArbitrumL2MessageClaimResponse,
} from 'src/features/rollup/arbitrum/types/api';
import type {
  OptimisticL2DepositsResponse,
  OptimisticL2OutputRootsResponse,
  OptimisticL2TxnBatchesResponse,
  OptimisticL2WithdrawalsResponse,
  OptimisticL2DisputeGamesResponse,
  OptimismL2TxnBatch,
} from 'src/features/rollup/optimism/types/api';
import type {
  ScrollL2BatchesResponse,
  ScrollL2TxnBatch,
  ScrollL2MessagesResponse,
} from 'src/features/rollup/scroll/types/api';
import type { ShibariumWithdrawalsResponse, ShibariumDepositsResponse } from 'src/features/rollup/shibarium/types/api';
import type { ZkSyncBatch, ZkSyncBatchesResponse } from 'src/features/rollup/zk-sync/types/api';

export const CORE_API_ROLLUP_RESOURCES = {
  optimistic_l2_deposits: {
    path: '/api/v2/optimism/deposits',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_deposits_count: {
    path: '/api/v2/optimism/deposits/count',
  },
  optimistic_l2_withdrawals: {
    path: '/api/v2/optimism/withdrawals',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_withdrawals_count: {
    path: '/api/v2/optimism/withdrawals/count',
  },
  optimistic_l2_output_roots: {
    path: '/api/v2/optimism/output-roots',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_output_roots_count: {
    path: '/api/v2/optimism/output-roots/count',
  },
  optimistic_l2_txn_batches: {
    path: '/api/v2/optimism/batches',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_txn_batches_count: {
    path: '/api/v2/optimism/batches/count',
  },
  optimistic_l2_txn_batch: {
    path: '/api/v2/optimism/batches/:number',
    pathParams: [ 'number' as const ],
  },
  optimistic_l2_txn_batch_celestia: {
    path: '/api/v2/optimism/batches/da/celestia/:height/:commitment',
    pathParams: [ 'height' as const, 'commitment' as const ],
  },
  optimistic_l2_txn_batch_txs: {
    path: '/api/v2/transactions/optimism-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_txn_batch_blocks: {
    path: '/api/v2/blocks/optimism-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_dispute_games: {
    path: '/api/v2/optimism/games',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_dispute_games_count: {
    path: '/api/v2/optimism/games/count',
  },

  // OPTIMISTIC INTEROP
  optimistic_l2_interop_messages: {
    path: '/api/v2/optimism/interop/messages',
    filterFields: [],
    paginated: true,
  },
  optimistic_l2_interop_messages_count: {
    path: '/api/v2/optimism/interop/messages/count',
  },

  // ARBITRUM
  arbitrum_l2_messages: {
    path: '/api/v2/arbitrum/messages/:direction',
    pathParams: [ 'direction' as const ],
    filterFields: [],
    paginated: true,
  },
  arbitrum_l2_messages_count: {
    path: '/api/v2/arbitrum/messages/:direction/count',
    pathParams: [ 'direction' as const ],
  },
  arbitrum_l2_txn_batches: {
    path: '/api/v2/arbitrum/batches',
    filterFields: [],
    paginated: true,
  },
  arbitrum_l2_txn_batches_count: {
    path: '/api/v2/arbitrum/batches/count',
  },
  arbitrum_l2_txn_batch: {
    path: '/api/v2/arbitrum/batches/:number',
    pathParams: [ 'number' as const ],
  },
  arbitrum_l2_txn_batch_celestia: {
    path: '/api/v2/arbitrum/batches/da/celestia/:height/:commitment',
    pathParams: [ 'height' as const, 'commitment' as const ],
  },
  arbitrum_l2_txn_batch_txs: {
    path: '/api/v2/transactions/arbitrum-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
  arbitrum_l2_txn_batch_blocks: {
    path: '/api/v2/blocks/arbitrum-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
  arbitrum_l2_txn_withdrawals: {
    path: '/api/v2/arbitrum/messages/withdrawals/:hash',
    pathParams: [ 'hash' as const ],
    filterFields: [],
  },
  arbitrum_l2_message_claim: {
    path: '/api/v2/arbitrum/messages/claim/:id',
    pathParams: [ 'id' as const ],
    filterFields: [],
  },

  // zkSync
  zksync_l2_txn_batches: {
    path: '/api/v2/zksync/batches',
    filterFields: [],
    paginated: true,
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
    paginated: true,
  },

  // SHIBARIUM
  shibarium_deposits: {
    path: '/api/v2/shibarium/deposits',
    filterFields: [],
    paginated: true,
  },
  shibarium_deposits_count: {
    path: '/api/v2/shibarium/deposits/count',
  },
  shibarium_withdrawals: {
    path: '/api/v2/shibarium/withdrawals',
    filterFields: [],
    paginated: true,
  },
  shibarium_withdrawals_count: {
    path: '/api/v2/shibarium/withdrawals/count',
  },

  // SCROLL
  scroll_l2_deposits: {
    path: '/api/v2/scroll/deposits',
    filterFields: [],
    paginated: true,
  },
  scroll_l2_deposits_count: {
    path: '/api/v2/scroll/deposits/count',
  },
  scroll_l2_withdrawals: {
    path: '/api/v2/scroll/withdrawals',
    filterFields: [],
    paginated: true,
  },
  scroll_l2_withdrawals_count: {
    path: '/api/v2/scroll/withdrawals/count',
  },
  scroll_l2_txn_batches: {
    path: '/api/v2/scroll/batches',
    filterFields: [],
    paginated: true,
  },
  scroll_l2_txn_batches_count: {
    path: '/api/v2/scroll/batches/count',
  },
  scroll_l2_txn_batch: {
    path: '/api/v2/scroll/batches/:number',
    pathParams: [ 'number' as const ],
  },
  scroll_l2_txn_batch_txs: {
    path: '/api/v2/transactions/scroll-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
  scroll_l2_txn_batch_blocks: {
    path: '/api/v2/blocks/scroll-batch/:number',
    pathParams: [ 'number' as const ],
    filterFields: [],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type CoreApiRollupResourceName = `core:${ keyof typeof CORE_API_ROLLUP_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiRollupResourcePayload<R extends CoreApiRollupResourceName> =
R extends 'core:optimistic_l2_output_roots' ? OptimisticL2OutputRootsResponse :
R extends 'core:optimistic_l2_withdrawals' ? OptimisticL2WithdrawalsResponse :
R extends 'core:optimistic_l2_deposits' ? OptimisticL2DepositsResponse :
R extends 'core:optimistic_l2_txn_batches' ? OptimisticL2TxnBatchesResponse :
R extends 'core:optimistic_l2_txn_batches_count' ? number :
R extends 'core:optimistic_l2_txn_batch' ? OptimismL2TxnBatch :
R extends 'core:optimistic_l2_txn_batch_celestia' ? OptimismL2TxnBatch :
R extends 'core:optimistic_l2_txn_batch_txs' ? paths['/v2/transactions/optimism-batch/{batch_number_param}']['get'] :
R extends 'core:optimistic_l2_txn_batch_blocks' ? paths['/v2/blocks/optimism-batch/{batch_number_param}']['get'] :
R extends 'core:optimistic_l2_dispute_games' ? OptimisticL2DisputeGamesResponse :
R extends 'core:optimistic_l2_output_roots_count' ? number :
R extends 'core:optimistic_l2_withdrawals_count' ? number :
R extends 'core:optimistic_l2_deposits_count' ? number :
R extends 'core:optimistic_l2_dispute_games_count' ? number :
R extends 'core:optimistic_l2_interop_messages' ? InteropMessageListResponse :
R extends 'core:optimistic_l2_interop_messages_count' ? number :
R extends 'core:shibarium_withdrawals' ? ShibariumWithdrawalsResponse :
R extends 'core:shibarium_deposits' ? ShibariumDepositsResponse :
R extends 'core:shibarium_withdrawals_count' ? number :
R extends 'core:shibarium_deposits_count' ? number :
R extends 'core:arbitrum_l2_messages' ? ArbitrumL2MessagesResponse :
R extends 'core:arbitrum_l2_messages_count' ? number :
R extends 'core:arbitrum_l2_txn_batches' ? ArbitrumL2TxnBatchesResponse :
R extends 'core:arbitrum_l2_txn_batches_count' ? number :
R extends 'core:arbitrum_l2_txn_batch' ? ArbitrumL2TxnBatch :
R extends 'core:arbitrum_l2_txn_batch_celestia' ? ArbitrumL2TxnBatch :
R extends 'core:arbitrum_l2_txn_batch_txs' ? paths['/v2/transactions/arbitrum-batch/{batch_number_param}']['get'] :
R extends 'core:arbitrum_l2_txn_batch_blocks' ? paths['/v2/blocks/arbitrum-batch/{batch_number_param}']['get'] :
R extends 'core:arbitrum_l2_txn_withdrawals' ? ArbitrumL2TxnWithdrawalsResponse :
R extends 'core:arbitrum_l2_message_claim' ? ArbitrumL2MessageClaimResponse :
R extends 'core:zksync_l2_txn_batches' ? ZkSyncBatchesResponse :
R extends 'core:zksync_l2_txn_batches_count' ? number :
R extends 'core:zksync_l2_txn_batch' ? ZkSyncBatch :
R extends 'core:zksync_l2_txn_batch_txs' ? paths['/v2/transactions/zksync-batch/{batch_number_param}']['get'] :
R extends 'core:scroll_l2_txn_batch_txs' ? paths['/v2/transactions/scroll-batch/{batch_number_param}']['get'] :
R extends 'core:scroll_l2_txn_batch_blocks' ? paths['/v2/blocks/scroll-batch/{batch_number_param}']['get'] :
R extends 'core:scroll_l2_txn_batches' ? ScrollL2BatchesResponse :
R extends 'core:scroll_l2_txn_batches_count' ? number :
R extends 'core:scroll_l2_txn_batch' ? ScrollL2TxnBatch :
R extends 'core:scroll_l2_deposits' ? ScrollL2MessagesResponse :
R extends 'core:scroll_l2_deposits_count' ? number :
R extends 'core:scroll_l2_withdrawals' ? ScrollL2MessagesResponse :
R extends 'core:scroll_l2_withdrawals_count' ? number :
never;
/* eslint-enable @stylistic/indent */

export type CoreApiRollupPaginationFilters = never;

export type CoreApiRollupPaginationSorting = never;
