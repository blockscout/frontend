import * as multichain from '@blockscout/multichain-aggregator-types';

import { ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

export const INTEROP_MESSAGE: multichain.InteropMessage = {
  sender: {
    hash: ADDRESS_HASH,
  },
  target: {
    hash: ADDRESS_HASH,
  },
  nonce: 4261,
  init_chain_id: '420120000',
  init_transaction_hash: TX_HASH,
  timestamp: '2025-06-03T10:43:58.000Z',
  relay_chain_id: '420120001',
  relay_transaction_hash: TX_HASH,
  payload: '0x4f0edcc90000000000000000000000004',
  message_type: 'coin_transfer',
  method: 'sendERC20',
  status: multichain.InteropMessage_Status.PENDING,
};
