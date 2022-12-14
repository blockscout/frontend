import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { SocketProvider } from 'lib/socket/context';
import { PORT } from 'playwright/fixtures/socketServer';
import theme from 'theme';

type Props = {
  children: React.ReactNode;
  withSocket?: boolean;
}

const TestApp = ({ children, withSocket }: Props) => {
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
        <SocketProvider url={ withSocket ? `ws://localhost:${ PORT }` : undefined }>
          { children }
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
