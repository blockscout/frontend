import type {
  OptimisticL2DepositsItem,
  OptimisticL2OutputRootsItem,
  OptimisticL2TxnBatchesItem,
  OptimisticL2WithdrawalsItem,
} from 'types/api/optimisticL2';

import { ADDRESS_HASH, ADDRESS_PARAMS } from './addressParams';
import { TX_HASH } from './tx';

export const L2_DEPOSIT_ITEM: OptimisticL2DepositsItem = {
  l1_block_number: 9045233,
  l1_block_timestamp: '2023-05-22T18:00:36.000000Z',
  l1_tx_hash: TX_HASH,
  l1_tx_origin: ADDRESS_HASH,
  l2_tx_gas_limit: '100000',
  l2_tx_hash: TX_HASH,
};

export const L2_WITHDRAWAL_ITEM: OptimisticL2WithdrawalsItem = {
  challenge_period_end: null,
  from: ADDRESS_PARAMS,
  l1_tx_hash: TX_HASH,
  l2_timestamp: '2023-06-01T13:44:56.000000Z',
  l2_tx_hash: TX_HASH,
  msg_nonce: 2393,
  msg_nonce_version: 1,
  status: 'Ready to prove',
};

export const L2_TXN_BATCHES_ITEM: OptimisticL2TxnBatchesItem = {
  l1_timestamp: '2023-06-01T14:46:48.000000Z',
  l1_tx_hashes: [
    TX_HASH,
  ],
  l2_block_number: 5218590,
  tx_count: 9,
};

export const L2_OUTPUT_ROOTS_ITEM: OptimisticL2OutputRootsItem = {
  l1_block_number: 9103684,
  l1_timestamp: '2023-06-01T15:26:12.000000Z',
  l1_tx_hash: TX_HASH,
  l2_block_number: 10102468,
  l2_output_index: 50655,
  output_root: TX_HASH,
};
