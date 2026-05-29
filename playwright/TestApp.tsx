import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { http } from 'viem';
import { WagmiProvider, createConfig, mock } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import type { Props as PageProps } from 'src/server/getServerSideProps/handlers';

import { SocketProvider } from 'src/api/socket/context';

import { AppContextProvider } from 'src/shell/app/context';
import { SettingsContextProvider } from 'src/shell/top-bar/settings/context';

import { currentChain } from 'src/features/connect-wallet/utils/chains';
import { CsvExportContextProvider } from 'src/features/csv-export/utils/context';
import { MarketplaceContext } from 'src/features/marketplace/context';
import { RewardsContextProvider } from 'src/features/rewards/context';

import config from 'src/config';

import { Provider as ChakraProvider } from 'src/toolkit/chakra/provider';

import { port as socketPort } from './utils/socket';

export type Props = {
  children: React.ReactNode;
  withSocket?: boolean;
  withWalletClient?: boolean;
  appContext?: {
    pageProps: PageProps;
  };
  marketplaceContext?: {
    isAutoConnectDisabled: boolean;
    setIsAutoConnectDisabled: (isAutoConnectDisabled: boolean) => void;
  };
};

const defaultAppContext = {
  pageProps: {
    cookies: '',
    referrer: '',
    query: {},
    adBannerProvider: 'slise' as const,
    apiData: null,
    uuid: '123',
    onionDomain: null,
    cspNonce: null,
  },
};

const defaultMarketplaceContext = {
  isAutoConnectDisabled: false,
  setIsAutoConnectDisabled: () => {},
};

const wagmiConfig = createConfig({
  chains: [ currentChain ?? mainnet ],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      ],
    }),
  ],
  transports: {
    [currentChain?.id ?? mainnet.id]: http(),
  },
});

const TestApp = ({ children, withSocket, appContext = defaultAppContext, marketplaceContext = defaultMarketplaceContext }: Props) => {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }));

  return (
    <ChakraProvider>
      <QueryClientProvider client={ queryClient }>
        <SocketProvider url={ withSocket ? `ws://${ config.app.host }:${ socketPort }` : undefined }>
          <AppContextProvider { ...appContext }>
            <MarketplaceContext.Provider value={ marketplaceContext }>
              <SettingsContextProvider>
                <GrowthBookProvider>
                  <WagmiProvider config={ wagmiConfig! }>
                    <RewardsContextProvider>
                      <CsvExportContextProvider>
                        { children }
                      </CsvExportContextProvider>
                    </RewardsContextProvider>
                  </WagmiProvider>
                </GrowthBookProvider>
              </SettingsContextProvider>
            </MarketplaceContext.Provider>
          </AppContextProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default TestApp;
