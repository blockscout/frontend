import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit/networks';
import type { Chain } from 'viem';
import { fallback, http } from 'viem';
import { createConfig } from 'wagmi';

import config from 'configs/app';
import { currentChain, parentChain } from 'lib/web3/chains';

const feature = config.features.blockchainInteraction;

const chains = [ currentChain, parentChain ].filter(Boolean);

const wagmi = (() => {

  if (!feature.isEnabled) {
    const wagmiConfig = createConfig({
      chains: chains as [Chain, ...Array<Chain>],
      transports: {
        [currentChain.id]: fallback(
          config.chain.rpcUrls
            .map((url) => http(url))
            .concat(http(`${ config.apis.general.endpoint }/api/eth-rpc`)),
        ),
        ...(parentChain ? { [parentChain.id]: http(parentChain.rpcUrls.default.http[0]) } : {}),
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
      [currentChain.id]: fallback(config.chain.rpcUrls.map((url) => http(url))),
      ...(parentChain ? { [parentChain.id]: http() } : {}),
    },
    projectId: feature.walletConnect.projectId,
    ssr: true,
    batch: { multicall: { wait: 100 } },
    syncConnectedChain: false,
  });

  return { config: wagmiAdapter.wagmiConfig, adapter: wagmiAdapter };
})();

export default wagmi;
