// SPDX-License-Identifier: LicenseRef-Blockscout

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import type { DynamicContextProps, OnAuthSuccess } from '@dynamic-labs/sdk-react-core';
import { DynamicContextProvider, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'src/features/account/types/api';

import useApiFetch from 'src/api/hooks/useApiFetch';
import { getResourceKey } from 'src/api/hooks/useApiQuery';

import useGetCsrfToken from 'src/features/account/hooks/useGetCsrfToken';
import useLogout from 'src/features/account/hooks/useLogout';
import { chains } from 'src/features/connect-wallet/utils/chains';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import getErrorMessage from 'src/shared/errors/get-error-message';

import { toaster } from 'src/toolkit/chakra/toaster';
import { castToString } from 'src/toolkit/utils/guards';

import WagmiProvider from './WagmiProvider';

const feature = config.features.connectWallet;

const walletConnectors = [
  EthereumWalletConnectors,
  ZeroDevSmartWalletConnectors,
];

const overrides: DynamicContextProps['settings']['overrides'] = {
  evmNetworks: chains.map((chain) => {
    const logoUrl = castToString(chain.custom?.logoUrl);
    return {
      chainId: chain.id,
      name: chain.name,
      rpcUrls: chain.rpcUrls.default.http.slice(),
      nativeCurrency: chain.nativeCurrency,
      blockExplorerUrls: chain.blockExplorers ? [ chain.blockExplorers.default.url ] : [],
      networkId: chain.id,
      iconUrls: logoUrl ? [ logoUrl ] : [],
      isTestnet: chain.testnet,
    };
  }),
};

interface Props {
  children: React.ReactNode;
}

const DynamicProvider = ({ children }: Props) => {

  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  const csrfQuery = useGetCsrfToken();
  const onLogout = useLogout();

  const onAuthSuccess: OnAuthSuccess = React.useCallback(async() => {
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
      mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
        Action: 'Success',
        Source: 'Dynamic',
      });
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
    <DynamicContextProvider
      settings={ settings }
    >
      <WagmiProvider>
        <DynamicWagmiConnector>
          { children }
        </DynamicWagmiConnector>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};

export default React.memo(DynamicProvider);
