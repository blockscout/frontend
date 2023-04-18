import { useColorModeValue, useToken } from '@chakra-ui/react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import appConfig from 'configs/app/config';

const { wagmiClient, ethereumClient } = (() => {
  try {
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

    const { provider } = configureChains(chains, [
      walletConnectProvider({ projectId: appConfig.walletConnect.projectId || '' }),
    ]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'web3Modal', chains }),
      provider,
    });
    const ethereumClient = new EthereumClient(wagmiClient, chains);

    return { wagmiClient, ethereumClient };
  } catch (error) {
    return { wagmiClient: undefined, ethereumClient: undefined };
  }
})();

interface Props {
  children: React.ReactNode;
  fallback?: JSX.Element | (() => JSX.Element);
}

const Web3ModalProvider = ({ children, fallback }: Props) => {
  const modalZIndex = useToken<string>('zIndices', 'modal');
  const web3ModalTheme = useColorModeValue('light', 'dark');

  if (!wagmiClient || !ethereumClient) {
    return typeof fallback === 'function' ? fallback() : (fallback || null);
  }

  return (
    <WagmiConfig client={ wagmiClient }>
      { children }
      <Web3Modal
        projectId={ appConfig.walletConnect.projectId }
        ethereumClient={ ethereumClient }
        themeZIndex={ Number(modalZIndex) }
        themeMode={ web3ModalTheme }
        themeBackground="themeColor"
      />
    </WagmiConfig>
  );
};

export default Web3ModalProvider;
