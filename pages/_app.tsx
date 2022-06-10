import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/index';
import altTheme from '../theme_alt/index';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider theme={ router.query.theme === 'alt' ? altTheme : theme }>
      <Component { ...pageProps }/>
    </ChakraProvider>
  );
}

export default MyApp
