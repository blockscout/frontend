import type { Log, LogsResponseAddress, LogsResponseTx } from 'types/api/log';

import { ADDRESS_PARAMS } from './addressParams';
import { TX_HASH } from './tx';

export const LOG: Log = {
  address: ADDRESS_PARAMS,
  data: '0x000000000000000000000000000000000000000000000000000000d75e4be200',
  decoded: null,
  index: 42,
  topics: [
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    '0x000000000000000000000000c52ea157a7fb3e25a069d47df0428ac70cd656b1',
    '0x000000000000000000000000302fd86163cb9ad5533b3952dafa3b633a82bc51',
    null,
  ],
  tx_hash: TX_HASH,
};

export const TX_LOGS: LogsResponseTx = {
  items: Array(3).fill(LOG),
  next_page_params: null,
};

export const ADDRESS_LOGS: LogsResponseAddress = {
  items: Array(3).fill(LOG),
  next_page_params: {
    block_number: 9005750,
    index: 42,
    items_count: 50,
    transaction_index: 23,
  },
};
