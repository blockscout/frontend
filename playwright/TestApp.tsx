import { ChakraProvider } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { http } from 'viem';
import { WagmiProvider, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

import config from 'configs/app';
import { AppContextProvider } from 'lib/contexts/app';
import { SocketProvider } from 'lib/socket/context';
import theme from 'theme';

import { port as socketPort } from './utils/socket';

export type Props = {
  children: React.ReactNode;
  withSocket?: boolean;
  withWalletClient?: boolean;
  appContext?: {
    pageProps: PageProps;
  };
}

const defaultAppContext = {
  pageProps: {
    cookies: '',
    referrer: '',
    query: {},
    adBannerProvider: 'slise' as const,
    apiData: null,
  },
};

const wagmiConfig = createConfig({
  chains: [ sepolia ],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      ],
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

const WalletClientProvider = ({ children, withWalletClient }: { children: React.ReactNode; withWalletClient?: boolean }) => {
  if (withWalletClient) {
    return (
      <WagmiProvider config={ wagmiConfig }>
        { children }
      </WagmiProvider>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{ children }</>;
};

const TestApp = ({ children, withSocket, withWalletClient = true, appContext = defaultAppContext }: Props) => {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }));

  return (
    <ChakraProvider theme={ theme }>
      <QueryClientProvider client={ queryClient }>
        <SocketProvider url={ withSocket ? `ws://${ config.app.host }:${ socketPort }` : undefined }>
          <AppContextProvider { ...appContext }>
            <GrowthBookProvider>
              <WalletClientProvider withWalletClient={ withWalletClient }>
                { children }
              </WalletClientProvider>
            </GrowthBookProvider>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
