import type { ChainConfig } from 'types/multichain';

export const chainDataA = {
  slug: 'op-mainnet',
  config: {
    app: {
      baseUrl: 'https://op-mainnet.com',
    },
    chain: {
      name: 'OP Mainnet',
      id: '420',
      currency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    UI: {
      navigation: {
        icon: {
          'default': 'https://example.com/logo.png',
        },
      },
    },
  },
} as ChainConfig;
