import { useColorModeValue, useToken } from '@chakra-ui/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import appConfig from 'configs/app/config';

const getConfig = () => {
  try {
    if (!appConfig.walletConnect.projectId) {
      throw new Error('WalletConnect Project ID is not set');
    }

    const currentChain: Chain = {
      id: Number(appConfig.network.id),
      name: appConfig.network.name || '',
      network: appConfig.network.name || '',
      nativeCurrency: {
        decimals: appConfig.network.currency.decimals,
        name: appConfig.network.currency.name || '',
        symbol: appConfig.network.currency.symbol || '',
      },
      rpcUrls: {
        'public': {
          http: [ appConfig.network.rpcUrl || '' ],
        },
        'default': {
          http: [ appConfig.network.rpcUrl || '' ],
        },
      },
      blockExplorers: {
        'default': {
          name: 'Blockscout',
          url: appConfig.baseUrl,
        },
      },
    };

    const chains = [ currentChain ];

    const { publicClient } = configureChains(chains, [
      w3mProvider({ projectId: appConfig.walletConnect.projectId || '' }),
    ]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId: appConfig.walletConnect.projectId, chains }),
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

  if (!wagmiConfig || !ethereumClient || !appConfig.walletConnect.projectId) {
    return typeof fallback === 'function' ? fallback() : (fallback || null);
  }

  return (
    <>
      <WagmiConfig config={ wagmiConfig }>
        { children }
      </WagmiConfig>
      <Web3Modal
        projectId={ appConfig.walletConnect.projectId }
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
