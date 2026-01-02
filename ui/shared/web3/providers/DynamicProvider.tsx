import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import type { DynamicContextProps } from '@dynamic-labs/sdk-react-core';
import { DynamicContextProvider, getAuthToken, overrideNetworkRpcUrl } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import { chains } from 'lib/web3/chains';
import { toaster } from 'toolkit/chakra/toaster';
import useLogout from 'ui/snippets/auth/useLogout';

import WagmiProvider from './WagmiProvider';

const feature = config.features.blockchainInteraction;

const walletConnectors = [
  EthereumWalletConnectors,
];

const overrides: DynamicContextProps['settings']['overrides'] = {
  evmNetworks: (networks) => overrideNetworkRpcUrl(
    networks,
    chains.reduce((acc, chain) => {
      acc[String(chain.id)] = chain.rpcUrls.default.http.slice();
      return acc;
    }, {} as Record<string, Array<string>>),
  ),
};

interface Props {
  children: React.ReactNode;
}

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

  const settings: DynamicContextProps['settings'] = React.useMemo(() => {
    const environmentId = feature.isEnabled && feature.connectorType === 'dynamic' ? feature.dynamic.environmentId : undefined;

    if (!environmentId) {
      throw new Error('Dynamic environment ID is not set');
    }

    return {
      walletConnectors,
      environmentId,
      useMetamaskSdk: false,
      overrides,
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

export default React.memo(DynamicProvider);
