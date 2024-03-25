import { type Chain } from 'viem';

import config from 'configs/app';

const currentChain = {
  id: Number(config.chain.id),
  name: config.chain.name ?? '',
  nativeCurrency: {
    decimals: config.chain.currency.decimals,
    name: config.chain.currency.name ?? '',
    symbol: config.chain.currency.symbol ?? '',
  },
  rpcUrls: {
    'default': {
      http: [ config.chain.rpcUrl ?? '' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Blockscout',
      url: config.app.baseUrl,
    },
  },
  testnet: config.chain.isTestnet,
} as const satisfies Chain;

export default currentChain;
