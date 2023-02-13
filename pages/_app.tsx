import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

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

  const renderErrorScreen = React.useCallback((error?: Error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (error?.cause as any)?.status || 500;

    return (
      <AppError
        statusCode={ statusCode }
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
                <Component { ...pageProps }/>
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
