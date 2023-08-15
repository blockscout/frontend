import type { ChakraProps } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React from 'react';

import config from 'configs/app';
import { AppContextProvider } from 'lib/contexts/app';
import { ChakraProvider } from 'lib/contexts/chakra';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import useConfigSentry from 'lib/hooks/useConfigSentry';
import { SocketProvider } from 'lib/socket/context';
import theme from 'theme';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';

import 'lib/setLocale';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const ERROR_SCREEN_STYLES: ChakraProps = {
  h: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: 'fit-content',
  maxW: '800px',
  margin: '0 auto',
  p: { base: 4, lg: 0 },
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  useConfigSentry();

  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const errorPayload = getErrorObjPayload<{ status: number }>(error);
          const status = errorPayload?.status || getErrorObjStatusCode(error);
          if (status && status >= 400 && status < 500) {
            // don't do retry for client error responses
            return false;
          }
          return failureCount < 2;
        },
        useErrorBoundary: (error) => {
          const status = getErrorObjStatusCode(error);
          // don't catch error for "Too many requests" response
          return status === 429;
        },
      },
    },
  }));

  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  const getLayout = Component.getLayout ?? ((page) => <Layout>{ page }</Layout>);

  return (
    <ChakraProvider theme={ theme } cookies={ pageProps.cookies }>
      <AppErrorBoundary
        { ...ERROR_SCREEN_STYLES }
        onError={ handleError }
      >
        <AppContextProvider pageProps={ pageProps }>
          <QueryClientProvider client={ queryClient }>
            <ScrollDirectionProvider>
              <SocketProvider url={ `${ config.api.socket }${ config.api.basePath }/socket/v2` }>
                { getLayout(<Component { ...pageProps }/>) }
              </SocketProvider>
            </ScrollDirectionProvider>
            <ReactQueryDevtools/>
            <GoogleAnalytics/>
          </QueryClientProvider>
        </AppContextProvider>
      </AppErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
