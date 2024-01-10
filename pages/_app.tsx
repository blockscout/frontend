import { useColorMode, type ChakraProps } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import config from 'configs/app';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { ChakraProvider } from 'lib/contexts/chakra';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import { SocketProvider } from 'lib/socket/context';
import theme from 'theme';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';

import 'lib/setLocale';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const ERROR_SCREEN_STYLES: ChakraProps = {
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

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { colorMode } = useColorMode();

  const getLayout = Component.getLayout ?? ((page) => <Layout>{ page }</Layout>);

  return (
    <>
      <Head>
        <link rel="icon" sizes="32x32" type="image/png" href={ `/static/favicon-32x32-${ colorMode }.png` }/>
        <link rel="icon" sizes="16x16" type="image/png"href={ `/static/favicon-16x16-${ colorMode }.png` }/>
        <link rel="apple-touch-icon" sizes="180x180" href={ `/static/apple-touch-icon-${ colorMode }.png` }/>
      </Head>

      { getLayout(<Component { ...pageProps }/>) }
      <Analytics debug={ false }/>
      <SpeedInsights debug={ false }/>
    </>

  );
}

function AppWrapper({ pageProps, ...props }: AppPropsWithLayout) {
  const queryClient = useQueryClientConfig();

  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  return (
    <ChakraProvider theme={ theme } cookies={ pageProps.cookies }>

      <AppErrorBoundary
        { ...ERROR_SCREEN_STYLES }
        onError={ handleError }
      >
        <AppContextProvider pageProps={ pageProps }>
          <QueryClientProvider client={ queryClient }>
            <ScrollDirectionProvider>
              <SocketProvider url={ `${ config.api.socket }${ config.api.basePath }/socket/v2` }>
                <MyApp pageProps={ pageProps } { ...props }/>
              </SocketProvider>
            </ScrollDirectionProvider>
            <ReactQueryDevtools/>
            <GoogleAnalytics/>
          </QueryClientProvider>
        </AppContextProvider>
      </AppErrorBoundary>
    </ChakraProvider>
  );
}

export default AppWrapper;
