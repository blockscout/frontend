import { ChakraProvider } from '@chakra-ui/react';
import type { ColorMode } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import theme from 'theme';

type Props = {
  children: React.ReactNode;
  colorMode?: ColorMode;
}

const TestApp = ({ children, colorMode = 'light' }: Props) => {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }));

  return (
    <ChakraProvider theme={{ ...theme, config: { ...theme.config, initialColorMode: colorMode } }}>
      <QueryClientProvider client={ queryClient }>
        { children }
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
