import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http } from 'viem';
import { createConfig } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
const feature = config.features.blockchainInteraction;

const wagmi = (() => {
  const chains = [ currentChain ];

  if (!feature.isEnabled) {
    const wagmiConfig = createConfig({
      chains: [ currentChain ],
      transports: {
        [currentChain.id]: http(config.chain.rpcUrl || `${ config.api.endpoint }/api/eth-rpc`),
      },
      ssr: true,
      batch: { multicall: { wait: 100 } },
    });

    return { config: wagmiConfig, adapter: null };
  }

  const wagmiAdapter = new WagmiAdapter({
    networks: chains,
    multiInjectedProviderDiscovery: true,
    transports: {
      [currentChain.id]: http(),
    },
    projectId: feature.walletConnect.projectId,
    ssr: true,
    batch: { multicall: { wait: 100 } },
  });

  return { config: wagmiAdapter.wagmiConfig, adapter: wagmiAdapter };
})();

export default wagmi;
