import type { AddressEpochRewardsResponse } from 'client/features/chain-variants/celo/types/api';

import { withEns, withName, withoutName } from 'client/slices/address/mocks/address';
import { tokenInfo } from 'client/slices/token/mocks/info';

export const epochRewards: AddressEpochRewardsResponse = {
  items: [
    {
      type: 'delegated_payment',
      amount: '136609473658452408568',
      account: withName,
      associated_account: withName,
      block_timestamp: '2022-05-15T13:16:24Z',
      epoch_number: 1526,
      token: tokenInfo,
    },
    {
      type: 'group',
      amount: '117205842355246195095',
      account: withoutName,
      associated_account: withoutName,
      block_timestamp: '2022-05-15T13:16:24Z',
      epoch_number: 1525,
      token: tokenInfo,
    },
    {
      type: 'validator',
      amount: '125659647325556554060',
      account: withEns,
      associated_account: withEns,
      block_timestamp: '2022-05-15T13:16:24Z',
      epoch_number: 1524,
      token: tokenInfo,
    },
  ],
  next_page_params: {
    amount: '71952055594478242556',
    associated_account_address_hash: '0x30d060f129817c4de5fbc1366d53e19f43c8c64f',
    epoch_number: 25954560,
    items_count: 50,
    type: 'delegated_payment',
  },
};
