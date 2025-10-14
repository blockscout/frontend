import type { ChainConfig } from 'types/multichain';

export const chainDataA = {
  slug: 'ethereum',
  config: {
    app: {
      baseUrl: 'https://eth.blockscout.com',
    },
    chain: {
      id: '1',
      name: 'Ethereum',
      currency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.eth.gateway.fm',
      ],
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
    UI: {
      navigation: {
        icon: {
          'default': './logo.png',
        },
      },
    },
  },
} as ChainConfig;
