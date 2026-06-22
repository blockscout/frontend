import type { schemas } from '@blockscout/api-types';

import { ADDRESS_HASH, ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

export const L2_DEPOSIT_ITEM: schemas['OptimismDeposit'] = {
  l1_block_number: 9045233,
  l1_block_timestamp: '2023-05-22T18:00:36.000000Z',
  l1_transaction_hash: TX_HASH,
  l1_transaction_origin: ADDRESS_HASH,
  l2_transaction_gas_limit: '100000',
  l2_transaction_hash: TX_HASH,
};

export const L2_WITHDRAWAL_ITEM: schemas['OptimismWithdrawal'] = {
  challenge_period_end: null,
  from: ADDRESS_PARAMS,
  l1_transaction_hash: TX_HASH,
  l2_timestamp: '2023-06-01T13:44:56.000000Z',
  l2_transaction_hash: TX_HASH,
  msg_nonce: 2393,
  msg_nonce_version: 1,
  status: 'Ready to prove',
  portal_contract_address_hash: null,
  msg_sender_address_hash: null,
  msg_target_address_hash: null,
  msg_data: null,
  msg_gas_limit: null,
  msg_nonce_raw: '',
  msg_value: null,
};

export const L2_TXN_BATCHES_ITEM: schemas['OptimismBatch'] = {
  number: 260991,
  batch_data_container: 'in_blob4844',
  l1_timestamp: '2023-06-01T14:46:48.000000Z',
  l1_transaction_hashes: [
    TX_HASH,
  ],
  l2_start_block_number: 5218590,
  l2_end_block_number: 5218777,
  transactions_count: 9,
};

export const L2_TXN_BATCH: schemas['OptimismBatchDetailed'] = {
  ...L2_TXN_BATCHES_ITEM,
  batch_data_container: 'in_blob4844',
  blobs: [
    {
      hash: '0x01fb41e1ae9f827e13abb0ee94be2ee574a23ac31426cea630ddd18af854bc85',
      l1_timestamp: '2024-09-03T13:26:23.000000Z',
      l1_transaction_hash: '0xd25ee571f1701690615099b208a9431d8611d0130dc342bead6d9edc291f04b9',
    },
  ],
};

export const L2_OUTPUT_ROOTS_ITEM: schemas['OptimismOutputRoot'] = {
  l1_block_number: 9103684,
  l1_timestamp: '2023-06-01T15:26:12.000000Z',
  l1_transaction_hash: TX_HASH,
  l2_block_number: 10102468,
  l2_output_index: 50655,
  output_root: TX_HASH,
};

export const L2_DISPUTE_GAMES_ITEM: schemas['OptimismGame'] = {
  contract_address_hash: ADDRESS_HASH,
  created_at: '2023-06-01T15:26:12.000000Z',
  game_type: 0,
  index: 6594,
  l2_block_number: 50655,
  resolved_at: null,
  status: 'In progress',
};
