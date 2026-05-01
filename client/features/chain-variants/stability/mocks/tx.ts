import type { Transaction } from 'client/slices/tx/types/api';

import { base } from 'client/slices/tx/mocks/tx';

export const stabilityTx: Transaction = {
  ...base,
  stability_fee: {
    dapp_address: {
      hash: '0xDc2B93f3291030F3F7a6D9363ac37757f7AD5C43',
      implementations: null,
      is_contract: false,
      is_verified: null,
      name: null,
      private_tags: [],
      public_tags: [],
      watchlist_names: [],
      ens_domain_name: null,
    },
    dapp_fee: '34381250000000',
    token: {
      address_hash: '0xDc2B93f3291030F3F7a6D9363ac37757f7AD5C43',
      circulating_market_cap: null,
      decimals: '18',
      exchange_rate: '123.567',
      holders_count: '92',
      icon_url: 'https://example.com/icon.png',
      name: 'Stability Gas',
      symbol: 'GAS',
      total_supply: '10000000000000000000000000',
      type: 'ERC-20',
      reputation: 'ok',
    },
    total_fee: '68762500000000',
    validator_address: {
      hash: '0x1432997a4058acbBe562F3c1E79738c142039044',
      implementations: null,
      is_contract: false,
      is_verified: null,
      name: null,
      private_tags: [],
      public_tags: [],
      watchlist_names: [],
      ens_domain_name: null,
    },
    validator_fee: '34381250000000',
  },
};
