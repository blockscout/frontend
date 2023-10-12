import type { ZkEvmL2TxnBatch, ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2TxnBatches';

import { TX_HASH } from './tx';

export const ZKEVM_L2_TXN_BATCHES_ITEM: ZkEvmL2TxnBatchesItem = {
  timestamp: '2023-06-01T14:46:48.000000Z',
  status: 'Finalized',
  verify_tx_hash: TX_HASH,
  sequence_tx_hash: TX_HASH,
  number: 5218590,
  tx_count: 9,
};

export const ZKEVM_L2_TXN_BATCH: ZkEvmL2TxnBatch = {
  acc_input_hash: '0xb815fe2832977f1324ad0124a019b938f189f7b470292f40a21284f15774b3b3',
  global_exit_root: '0x0000000000000000000000000000000000000000000000000000000000000000',
  number: 1,
  sequence_tx_hash: '0x57b9b95db5f94f125710bdc8fbb3fabaac10125b44b0cb61dbc69daddf06d0cd',
  state_root: '0xb9a589d6b3ae44d3b250a9993caa5e3721568197f56e4743989ecb2285d80ec4',
  status: 'Finalized',
  timestamp: '2023-09-15T06:22:48.000000Z',
  transactions: [ '0xff99dd67646b8f3d657cc6f19eb33abc346de2dbaccd03e45e7726cc28e3e186' ],
  verify_tx_hash: '0x093276fa65c67d7b12dd96f4fefafba9d9ad2f1c23c6e53f96583971ce75352d',
};
