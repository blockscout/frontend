import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { w3mProvider } from '@web3modal/ethereum';
import React from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

import { AppContextProvider } from 'lib/contexts/app';
import { SocketProvider } from 'lib/socket/context';
import * as app from 'playwright/utils/app';
import theme from 'theme';

type Props = {
  children: React.ReactNode;
  withSocket?: boolean;
  appContext?: {
    pageProps: PageProps;
  };
}

const defaultAppContext = {
  pageProps: {
    cookies: '',
    referrer: '',
    id: '',
    height_or_hash: '',
    hash: '',
    number: '',
    q: '',
  },
};

// >>> Web3 stuff
const { publicClient } = configureChains(
  [ mainnet ],
  [
    w3mProvider({ projectId: '' }),
  ],
);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [ ],
  publicClient,
});
// <<<<

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
        <SocketProvider url={ withSocket ? `ws://${ app.domain }:${ app.socketPort }` : undefined }>
          <AppContextProvider { ...appContext }>
            <WagmiConfig config={ wagmiConfig }>
              { children }
            </WagmiConfig>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
