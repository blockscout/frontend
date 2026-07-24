// SPDX-License-Identifier: LicenseRef-Blockscout

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit/networks';
import type { Chain, Transport } from 'viem';
import { fallback, http } from 'viem';
import { createConfig } from 'wagmi';

import { chains, parentChain } from 'src/features/connect-wallet/utils/chains';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';
import multichainConfig from 'src/features/multichain/chains-config';

import appConfig from 'src/config';

const feature = appConfig.features.connectWallet;

const getChainTransportFromConfig = (config: Partial<typeof appConfig> | undefined, readOnly?: boolean): Record<string, Transport> => {
  if (!config?.chain?.id) {
    return {};
  }

  return {
    [config.chain.id]: fallback(
      config.chain.rpcUrls
        .concat(readOnly && config.apis?.core ? `${ config.apis.core.endpoint }${ config.apis.core.basePath ?? '' }/api/eth-rpc` : '')
        .filter(Boolean)
        .map((url) => http(url, { batch: { wait: 100, batchSize: 5 } })),
    ),
  };
};

const reduceExternalChainsToTransportConfig = (readOnly: boolean): Record<string, Transport> => {
  const multichain = multichainConfig();
  const essentialDapps = essentialDappsChainsConfig();
  const chains = [ ...(multichain?.chains ?? []), ...(essentialDapps?.chains ?? []) ].filter(Boolean);

  if (!chains) {
    return {};
  }

  return chains
    .map(({ app_config: config }) => getChainTransportFromConfig(config, readOnly))
    .reduce((result, item) => {
      Object.entries(item).map(([ id, transport ]) => {
        result[id] = transport;
      });
      return result;
    }, {} as Record<string, Transport>);
};

const wagmi = (() => {

  if (!feature.isEnabled || feature.connectorType === 'dynamic') {
    const wagmiConfig = createConfig({
      chains: chains as [Chain, ...Array<Chain>],
      transports: {
        ...getChainTransportFromConfig(appConfig, true),
        ...(parentChain ? { [parentChain.id]: http(parentChain.rpcUrls.default.http[0]) } : {}),
        ...reduceExternalChainsToTransportConfig(true),
      },
      // ssr:false — the config is only ever created client-side (lazily, off the critical path), so wagmi's
      // <Hydrate> restores persisted state and reconnects synchronously; no manual hydration is needed.
      ssr: false,
      batch: { multicall: { wait: 100, batchSize: 1024 } },
      multiInjectedProviderDiscovery: feature.isEnabled && feature.connectorType === 'dynamic' ? false : true,
    });

    return { config: wagmiConfig, adapter: null };
  }

  const wagmiAdapter = new WagmiAdapter({
    networks: chains as Array<AppKitNetwork>,
    multiInjectedProviderDiscovery: true,
    transports: {
      ...getChainTransportFromConfig(appConfig, false),
      ...(parentChain ? { [parentChain.id]: http() } : {}),
      ...reduceExternalChainsToTransportConfig(false),
    },
    projectId: feature.reown.projectId,
    // ssr:false — see the note on the fallback config above; the adapter's config is client-only + lazy.
    ssr: false,
    batch: { multicall: { wait: 100, batchSize: 1024 } },
    syncConnectedChain: false,
  });

  return { config: wagmiAdapter.wagmiConfig, adapter: wagmiAdapter };
})();

export default wagmi;
