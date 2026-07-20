// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import type { Props as PageProps } from 'src/server/getServerSideProps/handlers';
import PageMetadata from 'src/server/PageMetadata';

import useQueryClientConfig from 'src/api/hooks/useQueryClientConfig';
import { SocketProvider } from 'src/api/socket/context';
import getSocketUrl from 'src/api/socket/get-socket-url';

import { AppContextProvider } from 'src/shell/app/context';
import Layout from 'src/shell/layout/Layout';
import { SettingsContextProvider } from 'src/shell/top-bar/settings/context';

import Web3Provider from 'src/features/connect-wallet/components/Web3Provider';
import { CsvExportContextProvider } from 'src/features/csv-export/utils/context';
import { MarketplaceContextProvider } from 'src/features/marketplace/context';

import config from 'src/config';
import GoogleAnalytics from 'src/services/google-analytics/GoogleAnalytics';
import useLoadFeatures from 'src/services/growthbook/useLoadFeatures';
import { clientConfig as rollbarConfig, Provider as RollbarProvider } from 'src/services/rollbar';
import AppErrorBoundary from 'src/shared/errors/AppErrorBoundary';
import AppErrorGlobalContainer from 'src/shared/errors/AppErrorGlobalContainer';
import { FallbackProvider } from 'src/shared/utils/fallback-provider';

import { Provider as ChakraProvider } from 'src/toolkit/chakra/provider';
import { Toaster } from 'src/toolkit/chakra/toaster';

const RewardsContextProvider = dynamic(() => import('src/features/rewards/context').then(module => module.RewardsContextProvider), { ssr: false });
const RewardsLoginModal = dynamic(() => import('src/features/rewards/components/login/RewardsLoginModal'), { ssr: false });
const RewardsActivityTracker = dynamic(() => import('src/features/rewards/components/RewardsActivityTracker'), { ssr: false });

import 'src/shared/i18n/set-locale';
// import 'focus-visible/dist/focus-visible';
import 'src/server/global.css';

type AppPropsWithLayout = AppProps<PageProps<'/'>> & {
  Component: NextPageWithLayout<PageProps<'/'>>;
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

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {

  const queryClient = useQueryClientConfig();
  const growthBook = useLoadFeatures(pageProps.uuid);

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

  const RewardsProvider = config.features.rewards.isEnabled ? RewardsContextProvider : FallbackProvider;

  const socketUrl = !config.features.multichain.isEnabled ? getSocketUrl() : undefined;

  return (
    <>
      <PageMetadata pathname={ router.pathname as Route['pathname'] } query={ pageProps.query } apiData={ pageProps.apiData }/>
      <ChakraProvider>
        <RollbarProvider config={ rollbarConfig }>
          <AppErrorBoundary
            { ...ERROR_SCREEN_STYLES }
            Container={ AppErrorGlobalContainer }
          >
            <QueryClientProvider client={ queryClient }>
              <Web3Provider>
                { /* Suspense boundary for the lazily-loaded `dynamic` connector hooks (useWalletDynamicLazy
                  / useAccountDynamicLazy `use()` a dynamic import). Pages router `next/dynamic(ssr:false)`
                  does not provide one. Inert for reown/fallback (nothing suspends); in Dynamic mode the
                  wallet hooks suspend on first render into this null fallback — the same window as today's
                  `ssr:false` gating, no remount. */ }
                <React.Suspense fallback={ null }>
                  <AppContextProvider pageProps={ pageProps }>
                    <GrowthBookProvider growthbook={ growthBook }>
                      <SocketProvider url={ socketUrl }>
                        <RewardsProvider>
                          <MarketplaceContextProvider>
                            <SettingsContextProvider>
                              <CsvExportContextProvider>
                                { content }
                              </CsvExportContextProvider>
                            </SettingsContextProvider>
                          </MarketplaceContextProvider>
                        </RewardsProvider>
                      </SocketProvider>
                    </GrowthBookProvider>
                    <ReactQueryDevtools buttonPosition="bottom-left" position="left"/>
                    <GoogleAnalytics/>
                  </AppContextProvider>
                </React.Suspense>
              </Web3Provider>
            </QueryClientProvider>
          </AppErrorBoundary>
        </RollbarProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
