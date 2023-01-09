import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import { AppContextProvider } from 'lib/appContext';
import { Chakra } from 'lib/Chakra';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import useConfigSentry from 'lib/hooks/useConfigSentry';
import { SocketProvider } from 'lib/socket/context';
import theme from 'theme';
import AppError from 'ui/shared/AppError/AppError';
import ErrorBoundary from 'ui/shared/ErrorBoundary';

export const poa: Chain = {
  id: 99,
  name: 'POA',
  network: 'poa',
  nativeCurrency: {
    decimals: 18,
    name: 'POA',
    symbol: 'POA',
  },
  rpcUrls: {
    'default': { http: [ 'https://core.poa.network' ] },
  },
  blockExplorers: {
    'default': { name: 'Blockscout', url: 'https://blockscout.com/poa/core' },
  },
};

const chains = [ poa ];

const PROJECT_ID = 'b4ed81be141093911032944632465175';
// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: PROJECT_ID }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }: AppProps) {
  useConfigSentry();
  const [ queryClient ] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, _error) => {
          const error = _error as ResourceError<{ status: number }>;
          const status = error?.status || error?.payload?.status;
          if (status && status >= 400 && status < 500) {
            // don't do retry for client error responses
            return false;
          }

          return failureCount < 2;
        },
      },
    },
  }));

  const renderErrorScreen = React.useCallback(() => {
    return (
      <AppError
        statusCode={ 500 }
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        width="fit-content"
        margin="0 auto"
      />
    );
  }, []);

  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  return (
    <Chakra theme={ theme } cookies={ pageProps.cookies }>
      <ErrorBoundary renderErrorScreen={ renderErrorScreen } onError={ handleError }>
        <AppContextProvider pageProps={ pageProps }>
          <QueryClientProvider client={ queryClient }>
            <ScrollDirectionProvider>
              <SocketProvider url={ `${ appConfig.api.socket }${ appConfig.api.basePath }/socket/v2` }>
                <WagmiConfig client={ wagmiClient }>
                  <Component { ...pageProps }/>
                </WagmiConfig>
                <Web3Modal
                  projectId={ PROJECT_ID }
                  ethereumClient={ ethereumClient }
                  themeZIndex={ 1200 }
                />
              </SocketProvider>
            </ScrollDirectionProvider>
            <ReactQueryDevtools/>
          </QueryClientProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </Chakra>
  );
}

export default MyApp;
