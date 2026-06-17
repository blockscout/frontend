import type { Transaction } from 'src/slices/tx/types/api';

import { toTokenModel } from 'src/slices/token/utils/model';
import { base } from 'src/slices/tx/mocks/tx';

export const celoTxn: Transaction = {
  ...base,
  celo: {
    gas_token: toTokenModel({
      address_hash: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
      circulating_market_cap: null,
      decimals: '18',
      exchange_rate: '0.42',
      holders_count: '205738',
      icon_url: 'https://example.com/icon.png',
      name: 'Celo Dollar',
      symbol: 'cUSD',
      total_supply: '7145754483836626799435133',
      type: 'ERC-20',
      reputation: 'ok',
    }),
  },
};
