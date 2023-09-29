import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvml2TxnBatches';

import { TX_HASH } from './tx';

export const ZKEVM_L2_TXN_BATCHES_ITEM: ZkEvmL2TxnBatchesItem = {
  timestamp: '2023-06-01T14:46:48.000000Z',
  status: 'Finalized',
  verify_tx_hash: TX_HASH,
  sequence_tx_hash: TX_HASH,
  number: 5218590,
  tx_count: 9,
};
