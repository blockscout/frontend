import { type Chain } from 'viem';

import appConfig from 'configs/app';
import multichainConfig from 'configs/multichain';

const getChainInfo = (config: typeof appConfig = appConfig) => {
  return {
    id: Number(config.chain.id),
    name: config.chain.name ?? '',
    nativeCurrency: {
      decimals: config.chain.currency.decimals,
      name: config.chain.currency.name ?? '',
      symbol: config.chain.currency.symbol ?? '',
    },
    rpcUrls: {
      'default': {
        http: config.chain.rpcUrls,
      },
    },
    blockExplorers: {
      'default': {
        name: 'Blockscout',
        url: config.app.baseUrl,
      },
    },
    testnet: config.chain.isTestnet,
  };
};

export const currentChain: Chain | undefined = !appConfig.features.opSuperchain.isEnabled ? getChainInfo() : undefined;

export const parentChain: Chain | undefined = (() => {
  const rollupFeature = appConfig.features.rollup;

  const parentChain = rollupFeature.isEnabled && rollupFeature.parentChain;

  if (!parentChain) {
    return;
  }

  if (!parentChain.id || !parentChain.name || !parentChain.rpcUrls || !parentChain.baseUrl || !parentChain.currency) {
    return;
  }

  return {
    id: parentChain.id,
    name: parentChain.name,
    nativeCurrency: parentChain.currency,
    rpcUrls: {
      'default': {
        http: parentChain.rpcUrls,
      },
    },
    blockExplorers: {
      'default': {
        name: 'Blockscout',
        url: parentChain.baseUrl,
      },
    },
    testnet: parentChain.isTestnet,
  };
})();

export const clusterChains: Array<Chain> | undefined = (() => {
  const config = multichainConfig();

  if (!config) {
    return;
  }

  return config.chains.map(({ config }) => getChainInfo(config)).filter(Boolean);
})();
