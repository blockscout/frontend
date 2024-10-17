import type { AddressEpochRewardsResponse } from 'types/api/address';

import { tokenInfo } from 'mocks/tokens/tokenInfo';

import { withEns, withName, withoutName } from './address';

export const epochRewards: AddressEpochRewardsResponse = {
  items: [
    {
      type: 'delegated_payment',
      amount: '136609473658452408568',
      account: withName,
      associated_account: withName,
      block_hash: '0x',
      block_number: 26369280,
      epoch_number: 1526,
      token: tokenInfo,
    },
    {
      type: 'group',
      amount: '117205842355246195095',
      account: withoutName,
      associated_account: withoutName,
      block_hash: '0x',
      block_number: 26352000,
      epoch_number: 1525,
      token: tokenInfo,
    },
    {
      type: 'validator',
      amount: '125659647325556554060',
      account: withEns,
      associated_account: withEns,
      block_hash: '0x',
      block_number: 26300160,
      epoch_number: 1524,
      token: tokenInfo,
    },
  ],
  next_page_params: null,
};
