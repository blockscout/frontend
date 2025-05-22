import type { HTMLChakraProps } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import config from 'configs/app';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { RewardsContextProvider } from 'lib/contexts/rewards';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import { SettingsContextProvider } from 'lib/contexts/settings';
import { initGrowthBook } from 'lib/growthbook/init';
import useLoadFeatures from 'lib/growthbook/useLoadFeatures';
import { clientConfig as rollbarConfig, Provider as RollbarProvider } from 'lib/rollbar';
import { SocketProvider } from 'lib/socket/context';
import { Provider as ChakraProvider } from 'toolkit/chakra/provider';
import { Toaster } from 'toolkit/chakra/toaster';
import RewardsLoginModal from 'ui/rewards/login/RewardsLoginModal';
import RewardsActivityTracker from 'ui/rewards/RewardsActivityTracker';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import AppErrorGlobalContainer from 'ui/shared/AppError/AppErrorGlobalContainer';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

import 'lib/setLocale';
// import 'focus-visible/dist/focus-visible';
import 'nextjs/global.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const ERROR_SCREEN_STYLES: HTMLChakraProps<'div'> = {
  h: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: 'fit-content',
  maxW: '800px',
  margin: { base: '0 auto', lg: '0 auto' },
  p: { base: 4, lg: 0 },
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const growthBook = initGrowthBook(pageProps.uuid);
  useLoadFeatures(growthBook);

  const queryClient = useQueryClientConfig();

  const content = (() => {
    const getLayout = Component.getLayout ?? ((page) => <Layout>{ page }</Layout>);

    return (
      <>
        { getLayout(<Component { ...pageProps }/>) }
        <Toaster/>
        { config.features.rewards.isEnabled && (
          <>
            <RewardsLoginModal/>
            <RewardsActivityTracker/>
          </>
        ) }
      </>
    );
  })();

  return (
    <ChakraProvider>
      <RollbarProvider config={ rollbarConfig }>
        <AppErrorBoundary
          { ...ERROR_SCREEN_STYLES }
          Container={ AppErrorGlobalContainer }
        >
          <Web3ModalProvider>
            <AppContextProvider pageProps={ pageProps }>
              <QueryClientProvider client={ queryClient }>
                <GrowthBookProvider growthbook={ growthBook }>
                  <ScrollDirectionProvider>
                    <SocketProvider url={ `${ config.apis.general.socketEndpoint }${ config.apis.general.basePath ?? '' }/socket/v2` }>
                      <RewardsContextProvider>
                        <MarketplaceContextProvider>
                          <SettingsContextProvider>
                            { content }
                          </SettingsContextProvider>
                        </MarketplaceContextProvider>
                      </RewardsContextProvider>
                    </SocketProvider>
                  </ScrollDirectionProvider>
                </GrowthBookProvider>
                <ReactQueryDevtools buttonPosition="bottom-left" position="left"/>
                <GoogleAnalytics/>
              </QueryClientProvider>
            </AppContextProvider>
          </Web3ModalProvider>
        </AppErrorBoundary>
      </RollbarProvider>
    </ChakraProvider>
  );
}

export default MyApp;
