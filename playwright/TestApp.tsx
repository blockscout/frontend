import { ChakraProvider } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

import { AppContextProvider } from 'lib/contexts/app';
import { SocketProvider } from 'lib/socket/context';
import wagmiConfig from 'lib/web3/wagmiConfig';
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
    adBannerProvider: 'slise',
  },
};

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
              <WagmiProvider config={ wagmiConfig! }>
                { children }
              </WagmiProvider>
            </GrowthBookProvider>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
