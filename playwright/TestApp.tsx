import { ChakraProvider } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18n';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { http } from 'viem';
import { WagmiProvider, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

import config from 'configs/app';
import { AppContextProvider } from 'lib/contexts/app';
import { SocketProvider } from 'lib/socket/context';
import currentChain from 'lib/web3/currentChain';
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
  chains: [ currentChain ],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      ],
    }),
  ],
  transports: {
    [currentChain.id]: http(),
  },
});

const TestApp = ({ children, withSocket, appContext = defaultAppContext }: Props) => {
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
              <WagmiProvider config={ wagmiConfig }>
                <I18nextProvider i18n={ i18n }>
                  { children }
                </I18nextProvider>
              </WagmiProvider>
            </GrowthBookProvider>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
