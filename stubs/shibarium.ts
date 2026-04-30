import type { ShibariumDepositsItem, ShibariumWithdrawalsItem } from 'types/api/shibarium';

import { TX_HASH } from 'client/slices/tx/stubs/tx';

import { ADDRESS_PARAMS } from './addressParams';

export const SHIBARIUM_DEPOSIT_ITEM: ShibariumDepositsItem = {
  l1_block_number: 9045233,
  l1_transaction_hash: TX_HASH,
  l2_transaction_hash: TX_HASH,
  timestamp: '2023-05-22T18:00:36.000000Z',
  user: ADDRESS_PARAMS,
};

export const SHIBARIUM_WITHDRAWAL_ITEM: ShibariumWithdrawalsItem = {
  l2_block_number: 9045233,
  l1_transaction_hash: TX_HASH,
  l2_transaction_hash: TX_HASH,
  timestamp: '2023-05-22T18:00:36.000000Z',
  user: ADDRESS_PARAMS,
};
