import type { WithdrawalsItem } from 'client/features/chain-variants/beacon-chain/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';

export const WITHDRAWAL: WithdrawalsItem = {
  amount: '12565723',
  index: 3810697,
  receiver: ADDRESS_PARAMS,
  validator_index: 25987,
  block_number: 9005713,
  timestamp: '2023-05-12T19:29:12.000000Z',
};
