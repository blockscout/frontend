// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React, { useEffect, useMemo } from 'react';

import type { MarketplaceApp } from 'src/features/marketplace/types/client';

import * as metadata from 'src/shell/metadata';

import useIsAuth from 'src/features/account/hooks/useIsAuth';
import { useMarketplaceContext } from 'src/features/marketplace/context';

import config from 'src/config';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

import MarketplaceAppIframe from '../../components/MarketplaceAppIframe';
import useAppQuery from '../../hooks/useAppQuery';
import useAutoConnectWallet from '../../hooks/useAutoConnectWallet';
import { getAppUrl } from '../../utils/dapp';
import MarketplaceAppTopBar from './MarketplaceAppTopBar';

export default function MarketplaceApp() {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const isAuth = useIsAuth();
  const { colorMode } = useColorMode();
  useAutoConnectWallet();

  const query = useAppQuery(id, isAuth);
  const { data, isPlaceholderData } = query;

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
    if (data && !isPlaceholderData) {
      metadata.update(
        { pathname: '/apps/[id]', query: { id: data.id } },
        data,
      );
      setIsAutoConnectDisabled(!data.internalWallet);
    }
  }, [ data, isPlaceholderData, setIsAutoConnectDisabled ]);

  throwOnResourceLoadError(query);

  return (
    <Flex flexDirection="column" h="100%">
      <MarketplaceAppTopBar
        appId={ id }
        data={ data }
        isLoading={ isPlaceholderData }
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
