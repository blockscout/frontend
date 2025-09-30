import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit/networks';
import type { Chain, Transport } from 'viem';
import { fallback, http } from 'viem';
import { createConfig } from 'wagmi';

import appConfig from 'configs/app';
import multichainConfig from 'configs/multichain';
import { currentChain, parentChain, clusterChains } from 'lib/web3/chains';

const feature = appConfig.features.blockchainInteraction;

const chains = [ currentChain, parentChain, ...(clusterChains ?? []) ].filter(Boolean);

const getChainTransportFromConfig = (config: typeof appConfig, readOnly?: boolean): Record<string, Transport> => {
  if (!config.chain.id) {
    return {};
  }

  return {
    [config.chain.id]: fallback(
      config.chain.rpcUrls
        .concat(readOnly ? `${ config.apis.general.endpoint }/api/eth-rpc` : '')
        .filter(Boolean)
        .map((url) => http(url, { batch: { wait: 100 } })),
    ),
  };
};

const reduceClusterChainsToTransportConfig = (readOnly: boolean): Record<string, Transport> => {
  const config = multichainConfig();

  if (!config) {
    return {};
  }

  return config.chains
    .map(({ config }) => getChainTransportFromConfig(config, readOnly))
    .reduce((result, item) => {
      Object.entries(item).map(([ id, transport ]) => {
        result[id] = transport;
      });
      return result;
    }, {} as Record<string, Transport>);
};

const wagmi = (() => {

  if (!feature.isEnabled) {
    const wagmiConfig = createConfig({
      chains: chains as [Chain, ...Array<Chain>],
      transports: {
        ...getChainTransportFromConfig(appConfig, true),
        ...(parentChain ? { [parentChain.id]: http(parentChain.rpcUrls.default.http[0]) } : {}),
        ...reduceClusterChainsToTransportConfig(true),
      },
      ssr: true,
      batch: { multicall: { wait: 100 } },
    });

    return { config: wagmiConfig, adapter: null };
  }

  const wagmiAdapter = new WagmiAdapter({
    networks: chains as Array<AppKitNetwork>,
    multiInjectedProviderDiscovery: true,
    transports: {
      ...getChainTransportFromConfig(appConfig, false),
      ...(parentChain ? { [parentChain.id]: http() } : {}),
      ...reduceClusterChainsToTransportConfig(false),
    },
    projectId: feature.walletConnect.projectId,
    ssr: true,
    batch: { multicall: { wait: 100 } },
    syncConnectedChain: false,
  });

  return { config: wagmiAdapter.wagmiConfig, adapter: wagmiAdapter };
})();

export default wagmi;
