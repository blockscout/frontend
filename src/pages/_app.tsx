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

import { Web3Provider } from 'src/features/connect-wallet/context';
import { CsvExportContextProvider } from 'src/features/csv-export/utils/context';
import { MarketplaceContextProvider } from 'src/features/marketplace/context';

import config from 'src/config';
import GoogleAnalytics from 'src/services/google-analytics/GoogleAnalytics';
import useLoadFeatures from 'src/services/growthbook/useLoadFeatures';
import { clientConfig as rollbarConfig, Provider as RollbarProvider } from 'src/services/rollbar';
import AppErrorBoundary from 'src/shared/errors/AppErrorBoundary';
import AppErrorGlobalContainer from 'src/shared/errors/AppErrorGlobalContainer';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import { FallbackProvider } from 'src/shared/utils/fallback-provider';

import { Provider as ChakraProvider } from 'src/toolkit/chakra/provider';
import { Toaster } from 'src/toolkit/chakra/toaster';

const RewardsContextProvider = dynamic(() => import('src/features/rewards/context').then(module => module.RewardsContextProvider), { ssr: false });
const RewardsLoginModal = dynamic(() => import('src/features/rewards/components/login/RewardsLoginModal'), { ssr: false });
const RewardsActivityTracker = dynamic(() => import('src/features/rewards/components/RewardsActivityTracker'), { ssr: false });

// Dynamic connector mode still needs one root provider — its @dynamic-labs stack is not island-friendly
// (tracked follow-up) — and `ssr: false` keeps that stack out of the server render. reown/fallback never
// mount it, so this chunk stays out of their bundles.
const DynamicProvider = dynamic(() => import('src/features/connect-wallet/components/DynamicProvider'), { ssr: false });
const connectWalletFeature = config.features.connectWallet;
const walletConnectorType = connectWalletFeature.isEnabled ? connectWalletFeature.connectorType : undefined;

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

  // The app intentionally does not render on the server. Gating the shell on client mount preserves that
  // without putting a wallet chunk on the critical path, which a provider-based gate would. `PageNextJs`
  // already covers page content; this covers the layout shell.
  const isShellMounted = useIsMounted();

  const appTree = (
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
  );

  const walletBoundary = walletConnectorType === 'dynamic' ? (
    // The dynamic wallet hooks resolve their heavy connector through a dynamic import and suspend on first
    // render; the pages-router dynamic() wrapper provides no Suspense boundary of its own, so one is needed
    // here. A null fallback keeps the pre-connector window blank instead of remounting once it resolves.
    <DynamicProvider>
      <React.Suspense fallback={ null }>
        { appTree }
      </React.Suspense>
    </DynamicProvider>
  ) : (
    // reown / fallback: `<Web3Provider>` renders children provider-less at first paint (no wallet chunk on
    // the critical path) and swaps in a native `<WagmiProvider>` once the runtime loads — eagerly for a
    // returning user, or on the first wallet interaction / wallet route. It also owns the eager-load and
    // AppKit theme-sync that used to live in `Web3Boot`.
    <Web3Provider>
      { isShellMounted ? appTree : null }
    </Web3Provider>
  );

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
              { walletBoundary }
            </QueryClientProvider>
          </AppErrorBoundary>
        </RollbarProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
