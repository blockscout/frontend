import type { L2DepositsItem } from 'types/api/l2Deposits';

import { ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

export const L2_DEPOSIT_ITEM: L2DepositsItem = {
  l1_block_number: 9045233,
  l1_block_timestamp: '2023-05-22T18:00:36.000000Z',
  l1_tx_hash: TX_HASH,
  l1_tx_origin: ADDRESS_HASH,
  l2_tx_gas_limit: '100000',
  l2_tx_hash: TX_HASH,
};
