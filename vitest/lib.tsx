import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import React from 'react';
import { http } from 'viem';
import { WagmiProvider, createConfig, mock } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { SocketProvider } from 'src/api/socket/context';

import { AppContextProvider } from 'src/shell/app/context';
import { SettingsContextProvider } from 'src/shell/top-bar/settings/context';

import { currentChain } from 'src/features/connect-wallet/utils/chains';
import { CsvExportContextProvider } from 'src/features/csv-export/utils/context';
import { MarketplaceContext } from 'src/features/marketplace/context';
import { RewardsContextProvider } from 'src/features/rewards/context';

import { Provider as ChakraProvider } from 'src/toolkit/chakra/provider';

import 'src/shared/i18n/set-locale';

const PAGE_PROPS = {
  cookies: '',
  referrer: '',
  query: {},
  adBannerProvider: null,
  apiData: null,
  uuid: '123',
  onionDomain: null,
  cspNonce: null,
};

const marketplaceContext = {
  isAutoConnectDisabled: false,
  setIsAutoConnectDisabled: () => {},
};

const wagmiConfig = createConfig({
  chains: [ currentChain ?? mainnet ],
  connectors: [
    mock({
      accounts: [ '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' ],
    }),
  ],
  transports: {
    [currentChain?.id ?? mainnet.id]: http(),
  },
});

// The full app provider stack (mirrors playwright/TestApp.tsx; socket and wallet client stay
// inert) — heavy enough to mount whole page slices in jsdom.
const TestApp = ({ children }: { children: React.ReactNode }) => {
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
        <SocketProvider url={ undefined }>
          <AppContextProvider pageProps={ PAGE_PROPS }>
            <MarketplaceContext.Provider value={ marketplaceContext }>
              <SettingsContextProvider>
                <GrowthBookProvider>
                  <WagmiProvider config={ wagmiConfig }>
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

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestApp, ...options });

export * from '@testing-library/react';
export { customRender as render };
export { TestApp as wrapper };
