import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import { AppWrapper } from 'lib/appContext';
import { Chakra } from 'lib/Chakra';
import useConfigSentry from 'lib/hooks/useConfigSentry';
import type { ErrorType } from 'lib/hooks/useFetch';
import theme from 'theme';

function MyApp({ Component, pageProps }: AppProps) {
  useConfigSentry();

  const [ queryClient ] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, _error) => {
          const error = _error as ErrorType<{ status: number }>;
          const status = error?.error?.status;
          if (status && status >= 400 && status < 500) {
            // don't do retry for client error responses
            return false;
          }

          return failureCount < 2;
        },
      },
    },
  }));

  return (
    <AppWrapper pageProps={ pageProps }>
      <QueryClientProvider client={ queryClient }>
        <Chakra theme={ theme } cookies={ pageProps.cookies }>
          <Component { ...pageProps }/>
        </Chakra>
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </AppWrapper>
  );
}

export default MyApp;
