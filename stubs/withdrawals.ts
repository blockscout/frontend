import type { WithdrawalsItem, WithdrawalsResponse } from 'types/api/withdrawals';

import { ADDRESS_PARAMS } from './addressParams';

export const WITHDRAWAL: WithdrawalsItem = {
  amount: '12565723',
  index: 3810697,
  receiver: ADDRESS_PARAMS,
  validator_index: 25987,
  block_number: 9005713,
  timestamp: '2023-05-12T19:29:12.000000Z',
};

export const WITHDRAWALS: WithdrawalsResponse = {
  items: Array(50).fill(WITHDRAWAL),
  next_page_params: {
    index: 5,
    items_count: 50,
  },
};
