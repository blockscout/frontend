import type { ZkSyncBatchesItem } from 'types/api/zkSyncL2';

import { TX_HASH } from './tx';

export const ZKSYNC_L2_TXN_BATCHES_ITEM: ZkSyncBatchesItem = {
  commit_transaction_hash: TX_HASH,
  commit_transaction_timestamp: '2022-03-17T19:33:04.519145Z',
  execute_transaction_hash: TX_HASH,
  execute_transaction_timestamp: '2022-03-17T20:49:48.856345Z',
  number: 8002,
  prove_transaction_hash: TX_HASH,
  prove_transaction_timestamp: '2022-03-17T20:49:48.772442Z',
  status: 'Executed on L1',
  timestamp: '2024-03-17T17:00:11.000000Z',
  tx_count: 1215,
};
