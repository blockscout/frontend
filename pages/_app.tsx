import type { ChakraProps } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import appConfig from 'configs/app/config';
import { AppContextProvider } from 'lib/contexts/app';
import { ChakraProvider } from 'lib/contexts/chakra';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import getErrorCauseStatusCode from 'lib/errors/getErrorCauseStatusCode';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import useConfigSentry from 'lib/hooks/useConfigSentry';
import { SocketProvider } from 'lib/socket/context';
import theme from 'theme';
import AppError from 'ui/shared/AppError/AppError';
import AppErrorTooManyRequests from 'ui/shared/AppError/AppErrorTooManyRequests';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';

import 'lib/setLocale';

function MyApp({ Component, pageProps }: AppProps) {

  useConfigSentry();

  const [ queryClient ] = useState(() => new QueryClient({
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

  const renderErrorScreen = React.useCallback((error?: Error) => {
    const statusCode = getErrorCauseStatusCode(error) || getErrorObjStatusCode(error);

    const styles: ChakraProps = {
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

    if (statusCode === 429) {
      return <AppErrorTooManyRequests { ...styles }/>;
    }

    return (
      <AppError
        statusCode={ statusCode || 500 }
        { ...styles }
      />
    );
  }, []);

  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  return (
    <ChakraProvider theme={ theme } cookies={ pageProps.cookies }>
      <ErrorBoundary renderErrorScreen={ renderErrorScreen } onError={ handleError }>
        <AppContextProvider pageProps={ pageProps }>
          <QueryClientProvider client={ queryClient }>
            <ScrollDirectionProvider>
              <SocketProvider url={ `${ appConfig.api.socket }${ appConfig.api.basePath }/socket/v2` }>
                <Component { ...pageProps }/>
              </SocketProvider>
            </ScrollDirectionProvider>
            <ReactQueryDevtools/>
            <GoogleAnalytics/>
          </QueryClientProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
