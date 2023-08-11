import { useColorModeValue, useToken } from '@chakra-ui/react';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import config from 'configs/app';

const feature = config.features.blockchainInteraction;

const getConfig = () => {
  try {
    if (!feature.isEnabled) {
      throw new Error();
    }

    const currentChain: Chain = {
      id: Number(config.chain.id),
      name: config.chain.name || '',
      network: config.chain.name || '',
      nativeCurrency: {
        decimals: config.chain.currency.decimals,
        name: config.chain.currency.name || '',
        symbol: config.chain.currency.symbol || '',
      },
      rpcUrls: {
        'public': {
          http: [ config.chain.rpcUrl || '' ],
        },
        'default': {
          http: [ config.chain.rpcUrl || '' ],
        },
      },
      blockExplorers: {
        'default': {
          name: 'Blockscout',
          url: config.app.baseUrl,
        },
      },
    };

    const chains = [ currentChain ];

    const { publicClient } = configureChains(chains, [
      jsonRpcProvider({
        rpc: () => ({
          http: config.chain.rpcUrl || '',
        }),
      }),
    ]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId: feature.walletConnect.projectId, chains }),
      publicClient,
    });
    const ethereumClient = new EthereumClient(wagmiConfig, chains);

    return { wagmiConfig, ethereumClient };
  } catch (error) {
    return { wagmiConfig: undefined, ethereumClient: undefined };
  }
};

const { wagmiConfig, ethereumClient } = getConfig();

interface Props {
  children: React.ReactNode;
  fallback?: JSX.Element | (() => JSX.Element);
}

const Web3ModalProvider = ({ children, fallback }: Props) => {
  const modalZIndex = useToken<string>('zIndices', 'modal');
  const web3ModalTheme = useColorModeValue('light', 'dark');

  if (!wagmiConfig || !ethereumClient || !feature.isEnabled) {
    return typeof fallback === 'function' ? fallback() : (fallback || null);
  }

  return (
    <>
      <WagmiConfig config={ wagmiConfig }>
        { children }
      </WagmiConfig>
      <Web3Modal
        projectId={ feature.walletConnect.projectId }
        ethereumClient={ ethereumClient }
        themeMode={ web3ModalTheme }
        themeVariables={{
          '--w3m-z-index': modalZIndex,
        }}
      />
    </>
  );
};

export default Web3ModalProvider;
