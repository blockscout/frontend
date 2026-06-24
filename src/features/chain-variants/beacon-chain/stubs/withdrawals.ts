import type { schemas } from '@blockscout/api-types';

import { ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';

export const WITHDRAWAL: schemas['BeaconWithdrawal'] = {
  amount: '12565723',
  index: 3810697,
  receiver: ADDRESS_PARAMS,
  validator_index: 25987,
  block_number: 9005713,
  timestamp: '2023-05-12T19:29:12.000000Z',
};
