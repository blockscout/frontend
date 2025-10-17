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
      rpcUrls: [
        'https://rpc.op-mainnet.com',
      ],
    },
    UI: {
      navigation: {
        icon: {
          'default': '/logo.png',
        },
      },
    },
    apis: {
      general: {
        host: 'localhost',
        protocol: 'http',
        port: '4003',
        endpoint: 'http://localhost:4003',
        socketEndpoint: 'ws://localhost:3200',
      },
    },
    features: {
      csvExport: {
        isEnabled: true,
        reCaptcha: { siteKey: 'xxx' },
      },
      advancedFilter: {
        isEnabled: true,
      },
    },
  },
} as ChainConfig;
