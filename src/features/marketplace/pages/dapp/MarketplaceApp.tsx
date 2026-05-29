// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import type { MarketplaceApp } from 'src/features/marketplace/types/client';

import { route } from 'nextjs-routes';

import useApiFetch from 'src/api/hooks/useApiFetch';
import useFetch from 'src/api/hooks/useFetch';
import type { ResourceError } from 'src/api/resources';

import * as metadata from 'src/shell/metadata';

import useIsAuth from 'src/features/account/hooks/useIsAuth';
import { useMarketplaceContext } from 'src/features/marketplace/context';

import config from 'src/config';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

import MarketplaceAppIframe from '../../components/MarketplaceAppIframe';
import useAutoConnectWallet from '../../hooks/useAutoConnectWallet';
import { getAppUrl } from '../../utils/dapp';
import MarketplaceAppTopBar from './MarketplaceAppTopBar';

const feature = config.features.marketplace;

export default function MarketplaceApp() {
  const fetch = useFetch();
  const apiFetch = useApiFetch();
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const isAuth = useIsAuth();
  const { colorMode } = useColorMode();
  useAutoConnectWallet();

  const query = useQuery<unknown, ResourceError<unknown>, MarketplaceApp>({
    queryKey: [ 'marketplace-dapps', id ],
    queryFn: async() => {
      if (!feature.isEnabled) {
        return null;
      } else if ('configUrl' in feature) {
        const result = await fetch<Array<MarketplaceApp>, unknown>(feature.configUrl, undefined, { resource: 'marketplace-dapps' });
        if (!Array.isArray(result)) {
          throw result;
        }
        const item = result.find((app: MarketplaceApp) => app.id === id);
        if (!item) {
          throw { status: 404 };
        }
        return item;
      } else {
        return apiFetch('admin:marketplace_dapp', { pathParams: { instanceId: config.apis.admin?.instanceId, dappId: id } });
      }
    },
    enabled: feature.isEnabled,
  });
  const { data, isPending, refetch } = query;

  React.useEffect(() => {
    refetch();
  }, [ isAuth, refetch ]);

  const { setIsAutoConnectDisabled } = useMarketplaceContext();

  const appUrl = useMemo(() => getAppUrl(data?.url, router), [ data?.url, router ]);

  const message = useMemo(() => ({
    blockscoutColorMode: colorMode,
    blockscoutRootUrl: config.app.baseUrl + route({ pathname: '/' }),
    blockscoutAddressExplorerUrl: config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: '' } }),
    blockscoutTransactionExplorerUrl: config.app.baseUrl + route({ pathname: '/tx/[hash]', query: { hash: '' } }),
    blockscoutNetworkName: config.chain.name,
    blockscoutNetworkId: Number(config.chain.id),
    blockscoutNetworkCurrency: config.chain.currency,
    blockscoutNetworkRpc: config.chain.rpcUrls[0],
  }), [ colorMode ]);

  useEffect(() => {
    if (data) {
      metadata.update(
        { pathname: '/apps/[id]', query: { id: data.id } },
        { app_name: data.title },
      );
      setIsAutoConnectDisabled(!data.internalWallet);
    }
  }, [ data, setIsAutoConnectDisabled ]);

  throwOnResourceLoadError(query);

  return (
    <Flex flexDirection="column" h="100%">
      <MarketplaceAppTopBar
        appId={ id }
        data={ data }
        isLoading={ isPending }
      />
      <MarketplaceAppIframe
        appId={ id }
        appUrl={ appUrl }
        message={ message }
        mx={{ base: -4, lg: -6 }}
      />
    </Flex>
  );
};
