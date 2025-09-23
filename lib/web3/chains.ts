import { uniq, concat } from 'es-toolkit/compat';
import { type Chain } from 'viem';
import * as viemChains from 'viem/chains';

import appConfig from 'configs/app';
import essentialDappsChainsConfig from 'configs/essentialDappsChains';
import multichainConfig from 'configs/multichain';
import essentialDappsConfig from 'ui/marketplace/essentialDapps/config';

const allChains = Object.values(viemChains);

const getChainInfo = (config: typeof appConfig = appConfig) => {
  const defaultChain = allChains.find((c) => c.id === Number(config.chain.id));

  return {
    ...defaultChain,
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

  const defaultChain = allChains.find((c) => c.id === Number(parentChain.id));

  return {
    ...defaultChain,
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

const enabledChains = [ currentChain?.id, parentChain?.id, ...(clusterChains?.map((c) => c.id) ?? []) ].filter(Boolean);
const enabledEssentialDappsChains = uniq(concat(...Object.values(essentialDappsConfig).map(({ chains }) => chains)));
const filteredEssentialDappsChains = enabledEssentialDappsChains.filter((id) => !enabledChains.includes(Number(id)));

export const essentialDappsChains: Array<Chain> | undefined = filteredEssentialDappsChains.map((id) => {
  const defaultChain = allChains.find((c) => c.id === Number(id));
  const explorerUrl = essentialDappsChainsConfig[id];

  if (!defaultChain || !explorerUrl) {
    return undefined;
  }

  return {
    ...defaultChain,
    blockExplorers: {
      'default': {
        name: 'Blockscout',
        url: explorerUrl,
      },
    },
  };
}).filter(Boolean);
