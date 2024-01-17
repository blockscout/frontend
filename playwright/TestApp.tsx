import { ChakraProvider } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import React from 'react';
import { WagmiConfig } from 'wagmi';
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
    name: '',
  },
};

// >>> Web3 stuff
const chains = [ mainnet ];
const WALLET_CONNECT_PROJECT_ID = 'PROJECT_ID';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: WALLET_CONNECT_PROJECT_ID,
});

createWeb3Modal({
  wagmiConfig,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains,
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
            <GrowthBookProvider>
              <WagmiConfig config={ wagmiConfig }>
                { children }
              </WagmiConfig>
            </GrowthBookProvider>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
