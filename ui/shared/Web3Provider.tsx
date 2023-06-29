import '@rainbow-me/rainbowkit/styles.css';
import { useColorModeValue } from '@chakra-ui/react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  metaMaskWallet,
  trustWallet,
  braveWallet,
  rabbyWallet,
} from '@rainbow-me/rainbowkit/wallets';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

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

    const { chains, publicClient } = configureChains(
      [ currentChain ],
      [
        jsonRpcProvider({
          rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
        }),
        publicProvider(),
      ],
    );

    const projectId = appConfig.walletConnect.projectId;
    const appName = appConfig.network.name || 'Blockscout';

    const connectors = connectorsForWallets([
      {
        groupName: 'Featured 🦆',
        wallets: [
          coinbaseWallet({ chains, appName }),
          rainbowWallet({ projectId, chains }),
        ],
      },
      {
        groupName: 'Recommended 🦄',
        wallets: [
          metaMaskWallet({ chains, projectId }),
          trustWallet({ chains, projectId }),
          walletConnectWallet({ projectId, chains }),
          braveWallet({ chains }),
          rabbyWallet({ chains }),
          injectedWallet({ chains }),
        ],
      },
    ]);

    const wagmiConfig = createConfig({
      autoConnect: false,
      connectors,
      publicClient,
    });

    return { wagmiConfig, chains };
  } catch (error) {
    return { wagmiConfig: undefined, chains: undefined };
  }
};

const { wagmiConfig, chains } = getConfig();

interface Props {
  children: React.ReactNode;
  fallback?: JSX.Element | (() => JSX.Element);
}

const Web3ModalProvider = ({ children, fallback }: Props) => {
  const kitTheme = useColorModeValue(lightTheme, darkTheme);

  if (!wagmiConfig || !chains || !appConfig.walletConnect.projectId) {
    return typeof fallback === 'function' ? fallback() : (fallback || null);
  }

  return (
    <WagmiConfig config={ wagmiConfig }>
      <RainbowKitProvider chains={ chains } theme={ kitTheme() }>
        { children }
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3ModalProvider;
