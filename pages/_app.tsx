import type { HTMLChakraProps } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import config from 'configs/app';
import getSocketUrl from 'lib/api/getSocketUrl';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { RewardsContextProvider } from 'lib/contexts/rewards';
import { SettingsContextProvider } from 'lib/contexts/settings';
import { initGrowthBook } from 'lib/growthbook/init';
import useLoadFeatures from 'lib/growthbook/useLoadFeatures';
import usePageViewTracking from 'lib/monitoring/usePageViewTracking';
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

const CONSOLE_SCAM_WARNING = `⚠️WARNING: Do not paste or execute any scripts here!
Anyone asking you to run code here might be trying to scam you and steal your data.
If you don't understand what this console is for, close it now and stay safe.`;

const CONSOLE_SCAM_WARNING_DELAY_MS = 500;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const growthBook = initGrowthBook(pageProps.uuid);
  useLoadFeatures(growthBook);
  usePageViewTracking(pageProps.referrer);

  const queryClient = useQueryClientConfig();

  React.useEffect(() => {
    // after the app is rendered/hydrated, show the console scam warning
    const timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line no-console
      console.warn(CONSOLE_SCAM_WARNING);
    }, CONSOLE_SCAM_WARNING_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

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

  const socketUrl = !config.features.opSuperchain.isEnabled ? getSocketUrl() : undefined;

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
                  <SocketProvider url={ socketUrl }>
                    <RewardsContextProvider>
                      <MarketplaceContextProvider>
                        <SettingsContextProvider>
                          { content }
                        </SettingsContextProvider>
                      </MarketplaceContextProvider>
                    </RewardsContextProvider>
                  </SocketProvider>
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
