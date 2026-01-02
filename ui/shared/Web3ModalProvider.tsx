/* eslint-disable consistent-default-export-name/default-export-match-filename */
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { createAppKit, useAppKitTheme } from '@reown/appkit/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider as WagmiProviderCore } from 'wagmi';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import { chains } from 'lib/web3/chains';
import wagmiConfig from 'lib/web3/wagmiConfig';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { toaster } from 'toolkit/chakra/toaster';
import colors from 'toolkit/theme/foundations/colors';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';
import zIndex from 'toolkit/theme/foundations/zIndex';
import useLogout from 'ui/snippets/auth/useLogout';

const feature = config.features.blockchainInteraction;

const initReown = () => {
  try {
    if (!feature.isEnabled || !wagmiConfig.adapter || feature.connectorType === 'dynamic') {
      return;
    }

    createAppKit({
      adapters: [ wagmiConfig.adapter ],
      networks: chains as [AppKitNetwork, ...Array<AppKitNetwork>],
      metadata: {
        name: `${ config.chain.name } explorer`,
        description: `${ config.chain.name } explorer`,
        url: config.app.baseUrl,
        icons: [ config.UI.navigation.icon.default ].filter(Boolean),
      },
      projectId: feature.reown.projectId,
      features: {
        analytics: false,
        email: false,
        socials: [],
        onramp: false,
        swaps: false,
      },
      themeVariables: {
        '--w3m-font-family': `${ BODY_TYPEFACE }, sans-serif`,
        '--w3m-accent': colors.blue[600].value,
        '--w3m-border-radius-master': '2px',
        '--w3m-z-index': zIndex?.modal2?.value,
      },
      featuredWalletIds: feature.reown.featuredWalletIds,
      allowUnsupportedChain: true,
    });
  } catch (error) {}
};

initReown();

interface Props {
  children: React.ReactNode;
}

const WagmiProvider = ({ children }: Props) => {
  return (
    <WagmiProviderCore config={ wagmiConfig.config }>
      { children }
    </WagmiProviderCore>
  );
};

const ReownProvider = ({ children }: Props) => {
  const { colorMode } = useColorMode();
  const { setThemeMode } = useAppKitTheme();

  React.useEffect(() => {
    setThemeMode(colorMode ?? 'light');
  }, [ colorMode, setThemeMode ]);

  return (
    <WagmiProvider>
      { children }
    </WagmiProvider>
  );
};

const DynamicProvider = ({ children }: Props) => {

  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  const csrfQuery = useGetCsrfToken();
  const onLogout = useLogout();

  const onAuthSuccess = React.useCallback(async() => {
    // TODO @tom2drum check login via Merits button
    // TODO @tom2drum mixpanel events
    try {
      const authToken = getAuthToken();
      const response = await apiFetch<'general:auth_dynamic', UserInfo, unknown>('general:auth_dynamic', {
        fetchParams: {
          headers: {
            Authorization: `Bearer ${ authToken }`,
          },
        },
      });
      if (!('name' in response)) {
        throw Error('Something went wrong');
      }
      queryClient.setQueryData(getResourceKey('general:user_info'), () => response);
      csrfQuery.refetch();
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: getErrorMessage(error),
      });
    }
  }, [ apiFetch, csrfQuery, queryClient ]);

  const settings = React.useMemo(() => {
    const environmentId = feature.isEnabled && feature.connectorType === 'dynamic' ? feature.dynamic.environmentId : undefined;

    if (!environmentId) {
      throw new Error('Dynamic environment ID is not set');
    }

    return {
      walletConnectors: [
        EthereumWalletConnectors,
      ],
      environmentId,
      useMetamaskSdk: false,
      // TODO @tom2drum override RPC URL from dashboard
      // overrides: {},
      events: {
        onAuthSuccess,
        onLogout,
      },
    };
  }, [ onAuthSuccess, onLogout ]);

  return (
    <WagmiProvider>
      <DynamicContextProvider
        settings={ settings }
      >
        <DynamicWagmiConnector>
          { children }
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </WagmiProvider>
  );
};

const Provider = (() => {
  if (feature.isEnabled && feature.connectorType === 'reown') {
    return ReownProvider;
  }

  if (feature.isEnabled && feature.connectorType === 'dynamic') {
    return DynamicProvider;
  }

  return WagmiProvider;
})();

export default Provider;
