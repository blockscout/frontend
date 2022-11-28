import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import theme from 'theme';

type Props = {
  children: React.ReactNode;
}

const TestApp = ({ children }: Props) => {
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
        { children }
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
