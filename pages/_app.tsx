import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/index';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={ theme }>
      <Component { ...pageProps }/>
    </ChakraProvider>
  );
}

export default MyApp
