// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { base } from 'src/slices/block/mocks/details';

export const arbitrum: schemas['BlockResponse'] = {
  ...base,
  withdrawals_count: 3,
  arbitrum: {
    batch_number: 743991,
    batch_data_container: 'in_blob4844',
    commitment_transaction: {
      hash: '0x71a25e01dde129a308704de217d200ea42e0f5b8c221c8ba8b2b680ff347f708',
      status: 'finalized',
      timestamp: '2024-11-19T14:26:23.000000Z',
    },
    confirmation_transaction: {
      hash: '0x83b5a9fcae3bf8f19ff6a1d51e5e7ea8c5fcab9a0ef9d4a58c7ffdc1d1f1b0e2',
      status: 'unfinalized',
      timestamp: '2024-11-19T15:26:23.000000Z',
    },
    delayed_messages: 12003,
    l1_block_number: 21216851,
    send_count: 46893,
    send_root: '0x9bc6d3c7a4f61a8b5fbb27a50a1a0cfd3e97e5b6d8f28cd2f8c9d60e74b0e4a1',
    status: 'Confirmed on base',
  },
};
