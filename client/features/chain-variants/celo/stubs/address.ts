import type { AddressEpochRewardsItem } from 'client/features/chain-variants/celo/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';
import { TOKEN_INFO_ERC_20 } from 'client/slices/token/stubs';

export const EPOCH_REWARD_ITEM: AddressEpochRewardsItem = {
  amount: '136609473658452408568',
  block_timestamp: '2022-05-15T13:16:24Z',
  type: 'voter',
  token: TOKEN_INFO_ERC_20,
  account: ADDRESS_PARAMS,
  epoch_number: 1234,
  associated_account: ADDRESS_PARAMS,
};
