import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, type CreateConfigParameters } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
const feature = config.features.blockchainInteraction;

const wagmiConfig = (() => {
  const chains: CreateConfigParameters['chains'] = [ currentChain, mainnet, sepolia ];

  if (!feature.isEnabled) {
    const wagmiConfig = createConfig({
      chains,
      transports: {
        [currentChain.id]: http(config.chain.rpcUrl || `${ config.api.endpoint }/api/eth-rpc`),
        [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
        [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
      },
      ssr: true,
      batch: { multicall: { wait: 100 } },
    });

    return wagmiConfig;
  }

  const wagmiConfig = defaultWagmiConfig({
    chains,
    multiInjectedProviderDiscovery: true,
    transports: {
      [currentChain.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    projectId: feature.walletConnect.projectId,
    metadata: {
      name: `${ config.chain.name } explorer`,
      description: `${ config.chain.name } explorer`,
      url: config.app.baseUrl,
      icons: [ config.UI.navigation.icon.default ].filter(Boolean),
    },
    enableEmail: true,
    ssr: true,
    batch: { multicall: { wait: 100 } },
  });

  return wagmiConfig;
})();

export default wagmiConfig;
