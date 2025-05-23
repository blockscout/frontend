import type { MultichainConfig } from 'types/multichain';

import appConfig from 'configs/app';

const config = {
  chains: [
    {
      id: 'optimism-interop-alpha-0',
      name: 'OP Interop Alpha 0',
      chainId: 420120000,
      explorer: {
        url: 'https://optimism-interop-alpha-0.blockscout.com',
      },
      icon: '/static/duck.png',
      apis: {
        general: {
          endpoint: 'https://optimism-interop-alpha-0.blockscout.com',
          basePath: '',
          host: 'optimism-interop-alpha-0.blockscout.com',
          protocol: 'https',
          socketEndpoint: `${ appConfig.app.isDev ? 'ws' : 'wss' }://optimism-interop-alpha-0.blockscout.com/socket/v2`,
        },
      },
    },
    {
      id: 'optimism-interop-alpha-1',
      name: 'OP Interop Alpha 1',
      chainId: 420120001,
      explorer: {
        url: 'https://optimism-interop-alpha-1.blockscout.com',
      },
      icon: '/static/goose.png',
      apis: {
        general: {
          endpoint: 'https://optimism-interop-alpha-1.blockscout.com',
          basePath: '',
          host: 'optimism-interop-alpha-1.blockscout.com',
          protocol: 'https',
          socketEndpoint: `${ appConfig.app.isDev ? 'ws' : 'wss' }://optimism-interop-alpha-1.blockscout.com/socket/v2`,
        },
      },
    },
  ],
} satisfies MultichainConfig;

export default config;
