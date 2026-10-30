// SPDX-License-Identifier: LicenseRef-Blockscout

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit/networks';
import type { Chain, Transport } from 'viem';
import { fallback, http } from 'viem';
import { createConfig } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

import { chains, parentChain } from 'src/features/connect-wallet/utils/chains';
import { installEip6963AnnounceGuard } from 'src/features/connect-wallet/utils/install-eip6963-announce-guard';
import { getRpcUrls } from 'src/features/connect-wallet/utils/rpc-urls';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';
import multichainConfig from 'src/features/multichain/chains-config';

import appConfig from 'src/config';

const feature = appConfig.features.connectWallet;

const buildTransport = (urls: Array<string>): Transport => fallback(
  urls.filter(Boolean).map((url) => http(url, { batch: { wait: 100, batchSize: 5 } })),
);

const getOwnChainTransport = (readOnly: boolean): Record<string, Transport> => {
  if (!appConfig.chain.id) {
    return {};
  }

  return { [appConfig.chain.id]: buildTransport(getRpcUrls({ withCoreApiFallback: readOnly })) };
};

const getChainTransportFromConfig = (config: Partial<typeof appConfig> | undefined, readOnly?: boolean): Record<string, Transport> => {
  if (!config?.chain?.id) {
    return {};
  }

  const coreApiFallback = readOnly && config.apis?.core ? `${ config.apis.core.endpoint }${ config.apis.core.basePath ?? '' }/api/eth-rpc` : '';

  return { [config.chain.id]: buildTransport([ ...config.chain.rpcUrls, coreApiFallback ]) };
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

// Installed before the config below creates wagmi's mipd store, so the guard's listener is
// registered ahead of mipd's and can drop malformed EIP-6963 announce events before it throws on them.
installEip6963AnnounceGuard();

const wagmi = (() => {

  if (!feature.isEnabled || feature.connectorType === 'dynamic') {
    const wagmiConfig = createConfig({
      chains: chains as [Chain, ...Array<Chain>],
      transports: {
        ...(parentChain ? { [parentChain.id]: http(parentChain.rpcUrls.default.http[0]) } : {}),
        ...reduceExternalChainsToTransportConfig(true),
        ...getOwnChainTransport(true),
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
      ...(parentChain ? { [parentChain.id]: http() } : {}),
      ...reduceExternalChainsToTransportConfig(false),
      ...getOwnChainTransport(false),
    },
    projectId: feature.reown.projectId,
    // the adapter adds its own Coinbase connector unless one exists; ours turns off the SDK telemetry,
    // which is injected as an inline script and gets blocked by the CSP
    connectors: [ coinbaseWallet({ preference: { options: 'all', telemetry: false } }) ],
    // ssr:false — see the note on the fallback config above; the adapter's config is client-only + lazy.
    ssr: false,
    batch: { multicall: { wait: 100, batchSize: 1024 } },
    syncConnectedChain: false,
  });

  return { config: wagmiAdapter.wagmiConfig, adapter: wagmiAdapter };
})();

export default wagmi;
