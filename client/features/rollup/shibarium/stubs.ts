import type { ShibariumDepositsItem, ShibariumWithdrawalsItem } from 'client/features/rollup/shibarium/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';
import { TX_HASH } from 'client/slices/tx/stubs/tx';

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
