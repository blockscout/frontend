import type { L2DepositsItem } from 'types/api/l2Deposits';
import type { L2WithdrawalsItem } from 'types/api/l2Withdrawals';

import { ADDRESS_HASH, ADDRESS_PARAMS } from './addressParams';
import { TX_HASH } from './tx';

export const L2_DEPOSIT_ITEM: L2DepositsItem = {
  l1_block_number: 9045233,
  l1_block_timestamp: '2023-05-22T18:00:36.000000Z',
  l1_tx_hash: TX_HASH,
  l1_tx_origin: ADDRESS_HASH,
  l2_tx_gas_limit: '100000',
  l2_tx_hash: TX_HASH,
};

export const L2_WITHDRAWAL_ITEM: L2WithdrawalsItem = {
  challenge_period_end: null,
  from: ADDRESS_PARAMS,
  l1_tx_hash: TX_HASH,
  l2_timestamp: '2023-06-01T13:44:56.000000Z',
  l2_tx_hash: TX_HASH,
  msg_nonce: 2393,
  msg_nonce_version: 1,
  status: 'Ready to prove',
};
