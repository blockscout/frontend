import type { MultichainConfig } from 'types/multichain';

const config = {
  chains: [
    {
      id: 'optimism-interop-alpha-0',
      name: 'OP Interop Alpha 0',
      chainId: 420120000,
      explorer: {
        url: 'https://optimism-interop-alpha-0.blockscout.com',
      },
      icon: 'https://raw.githubusercontent.com/blockscout/frontend-configs/main/configs/network-icons/arbitrum-one-icon-light.svg',
      apis: {
        general: {
          endpoint: 'https://optimism-interop-alpha-0.blockscout.com',
          basePath: '',
          host: 'optimism-interop-alpha-0.blockscout.com',
          protocol: 'https',
          socketEndpoint: 'wss://optimism-interop-alpha-0.blockscout.com',
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
      icon: 'https://raw.githubusercontent.com/blockscout/frontend-configs/main/configs/network-icons/gnosis.svg',
      apis: {
        general: {
          endpoint: 'https://optimism-interop-alpha-1.blockscout.com',
          basePath: '',
          host: 'optimism-interop-alpha-1.blockscout.com',
          protocol: 'https',
          socketEndpoint: 'wss://optimism-interop-alpha-1.blockscout.com',
        },
      },
    },
  ],
} satisfies MultichainConfig;

export default config;
