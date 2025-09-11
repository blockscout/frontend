import type * as multichain from '@blockscout/multichain-aggregator-types';

import { ADDRESS_HASH } from './addressParams';

export const ADDRESS: multichain.GetAddressResponse = {
  hash: ADDRESS_HASH,
  chain_infos: {
    '420120000': {
      coin_balance: '1000000000000000000000000',
      is_contract: true,
      is_verified: true,
    },
  },
  has_tokens: true,
  has_interop_message_transfers: false,
};
