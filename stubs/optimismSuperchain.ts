import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { AddressTokenItem } from 'types/client/multichain-aggregator';

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

export const TOKEN: AddressTokenItem = {
  token: {
    address_hash: ADDRESS_HASH,
    circulating_market_cap: '10.01',
    decimals: '6',
    holders_count: '141268',
    icon_url: null,
    name: 'SR2USD',
    symbol: 'sR2USD',
    total_supply: '943969542711126',
    type: 'ERC-20' as const,
    exchange_rate: '123.456',
    chain_infos: {
      '11155111': {
        holders_count: '141268',
        total_supply: '943969542711126',
      },
    },
  },
  token_id: null,
  token_instance: null,
  value: '2860471393',
  chain_values: {
    '11155111': '2860471393',
  },
};
