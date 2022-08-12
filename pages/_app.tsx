import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import theme from 'theme';

function SafeHydrate({ children }: { children: React.ReactNode}) {
  return (
    <div suppressHydrationWarning>
      { typeof window === 'undefined' ? null : children }
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const [ queryClient ] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SafeHydrate>
      <QueryClientProvider client={ queryClient }>
        <ChakraProvider theme={ theme }>
          <Component { ...pageProps }/>
        </ChakraProvider>
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </SafeHydrate>
  );
}

export default MyApp;
