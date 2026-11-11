import type { schemas } from '@blockscout/api-types';

import { base } from 'src/slices/tx/mocks/details';

export const arbitrumTxn: schemas['TransactionResponse'] = {
  ...base,
  arbitrum: {
    batch_number: 743991,
    commitment_transaction: {
      hash: '0x71a25e01dde129a308704de217d200ea42e0f5b8c221c8ba8b2b680ff347f708',
      status: 'finalized',
      timestamp: '2024-11-19T14:26:23.000000Z',
    },
    confirmation_transaction: {
      hash: '0x9c5e2f1a7bd5c1f8e1a3c06c4b6e1f0dcd3a9b1c2e4f5a6b7c8d9e0f1a2b3c4d',
      status: 'unfinalized',
      timestamp: '2024-11-26T14:26:23.000000Z',
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
