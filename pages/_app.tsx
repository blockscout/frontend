import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import sentryConfig from 'configs/sentry/react';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import type { ErrorType } from 'lib/hooks/useFetch';
import theme from 'theme';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // gotta init sentry in browser
    Sentry.init(sentryConfig);
  }, []);

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
    <QueryClientProvider client={ queryClient }>
      <ChakraProvider theme={ theme }>
        <Component { ...pageProps }/>
      </ChakraProvider>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

export default MyApp;
