import type { Transaction } from 'client/slices/tx/types/api';

import { base } from 'client/slices/tx/mocks/tx';

export const arbitrumTxn: Transaction = {
  ...base,
  arbitrum: {
    batch_number: 743991,
    commitment_transaction: {
      hash: '0x71a25e01dde129a308704de217d200ea42e0f5b8c221c8ba8b2b680ff347f708',
      status: 'unfinalized',
      timestamp: '2024-11-19T14:26:23.000000Z',
    },
    confirmation_transaction: {
      hash: null,
      status: null,
      timestamp: null,
    },
    contains_message: null,
    gas_used_for_l1: '129773',
    gas_used_for_l2: '128313',
    message_related_info: {
      associated_l1_transaction_hash: null,
      message_status: 'Relayed',
    },
    network_fee: '1283130000000',
    poster_fee: '1297730000000',
    status: 'Sent to base',
  },
};
