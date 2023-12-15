import { useColorMode } from '@chakra-ui/react';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { createWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

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

    const { publicClient, webSocketPublicClient, chains } = configureChains(
      [ currentChain ],
      [
        jsonRpcProvider({
          rpc: () => ({
            http: config.chain.rpcUrl || '',
          }),
        }),
      ],
    );

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: [
        new WalletConnectConnector({
          chains,
          options: { projectId: feature.walletConnect.projectId, showQrModal: false },
        }),
      ],
      publicClient,
      webSocketPublicClient,
    });

    createWeb3Modal({
      wagmiConfig,
      projectId: feature.walletConnect.projectId,
      chains,
      themeVariables: {
        '--w3m-font-family': 'Inter, sans-serif',
        '--w3m-accent': '#2B6CB0', // blue.400
        '--w3m-border-radius-master': '2px',
        '--w3m-z-index': 1400,
      },
    });

    return { wagmiConfig };
  } catch (error) {
    return { };
  }
};

const { wagmiConfig } = getConfig();

interface Props {
  children: React.ReactNode;
  fallback?: JSX.Element | (() => JSX.Element);
}

const Web3ModalProvider = ({ children, fallback }: Props) => {
  const { colorMode } = useColorMode();
  const { setThemeMode } = useWeb3ModalTheme();

  React.useEffect(() => {
    if (wagmiConfig && feature.isEnabled) {
      setThemeMode(colorMode);
    }
  }, [ colorMode, setThemeMode ]);

  if (!wagmiConfig || !feature.isEnabled) {
    return typeof fallback === 'function' ? fallback() : (fallback || <>{ children }</>); // eslint-disable-line react/jsx-no-useless-fragment
  }

  return (
    <WagmiConfig config={ wagmiConfig }>
      { children }
    </WagmiConfig>
  );
};

export default Web3ModalProvider;
