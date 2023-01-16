import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { providers } from 'ethers';
import React from 'react';
import { createClient, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { MockConnector } from 'wagmi/connectors/mock';

import { AppContextProvider } from 'lib/appContext';
import type { Props as PageProps } from 'lib/next/getServerSideProps';
import { SocketProvider } from 'lib/socket/context';
import { PORT } from 'playwright/fixtures/socketServer';
import theme from 'theme';

type Props = {
  children: React.ReactNode;
  withSocket?: boolean;
  withWeb3?: boolean;
  appContext?: {
    pageProps: PageProps;
  };
}

const defaultAppContext = {
  pageProps: {
    cookies: '',
    referrer: '',
  },
};

const TestApp = ({ children, withSocket, withWeb3, appContext = defaultAppContext }: Props) => {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ wagmiClient ] = React.useState<any>(() => {
    if (!withWeb3) {
      return;
    }

    const provider = new providers.JsonRpcProvider(
      'http://localhost:8545',
      {
        name: 'POA',
        chainId: 99,
      },
    );

    const connector = new MockConnector({
      chains: [ mainnet ],
      options: {
        signer: provider.getSigner(),
      },
    });

    return createClient({
      autoConnect: true,
      connectors: [ connector ],
      provider,
    });
  });

  const content = wagmiClient ? (
    <WagmiConfig client={ wagmiClient }>
      { children }
    </WagmiConfig>
  ) : children;

  return (
    <ChakraProvider theme={ theme }>
      <QueryClientProvider client={ queryClient }>
        <SocketProvider url={ withSocket ? `ws://localhost:${ PORT }` : undefined }>
          <AppContextProvider { ...appContext }>
            { content }
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
