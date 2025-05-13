import { Center, chakra, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { DappscoutIframeProvider, useDappscoutIframe } from 'dappscout-iframe';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useFetch from 'lib/hooks/useFetch';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import { useColorMode } from 'toolkit/chakra/color-mode';
import ContentLoader from 'ui/shared/ContentLoader';

import MarketplaceAppTopBar from '../marketplace/MarketplaceAppTopBar';
import useAutoConnectWallet from '../marketplace/useAutoConnectWallet';
import useMarketplaceWallet from '../marketplace/useMarketplaceWallet';
import useSecurityReports from '../marketplace/useSecurityReports';
import { getAppUrl } from '../marketplace/utils';

const feature = config.features.marketplace;

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

type Props = {
  address: string | undefined;
  data: MarketplaceAppOverview | undefined;
  isPending: boolean;
  appUrl?: string;
};

const MarketplaceAppContent = ({ address, data, isPending, appUrl }: Props) => {
  const { iframeRef, isReady } = useDappscoutIframe();

  const [ iframeKey, setIframeKey ] = useState(0);
  const [ isFrameLoading, setIsFrameLoading ] = useState(isPending);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIframeKey((key) => key + 1);
  }, [ address ]);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  useEffect(() => {
    if (data && !isFrameLoading) {
      const message = {
        blockscoutColorMode: colorMode,
        blockscoutRootUrl: config.app.baseUrl + route({ pathname: '/' }),
        blockscoutAddressExplorerUrl: config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: '' } }),
        blockscoutTransactionExplorerUrl: config.app.baseUrl + route({ pathname: '/tx/[hash]', query: { hash: '' } }),
        blockscoutNetworkName: config.chain.name,
        blockscoutNetworkId: Number(config.chain.id),
        blockscoutNetworkCurrency: config.chain.currency,
        blockscoutNetworkRpc: config.chain.rpcUrls[0],
      };

      iframeRef?.current?.contentWindow?.postMessage(message, data.url);
    }
  }, [ isFrameLoading, data, colorMode, iframeRef ]);

  return (
    <Center
      flexGrow={ 1 }
      mx={{ base: -4, lg: -6 }}
    >
      { (isFrameLoading) && (
        <ContentLoader/>
      ) }

      { (data && isReady) && (
        <chakra.iframe
          key={ iframeKey }
          allow={ IFRAME_ALLOW_ATTRIBUTE }
          ref={ iframeRef }
          sandbox={ IFRAME_SANDBOX_ATTRIBUTE }
          h="100%"
          w="100%"
          display={ isFrameLoading ? 'none' : 'block' }
          src={ appUrl }
          title={ data.title }
          onLoad={ handleIframeLoad }
        />
      ) }
    </Center>
  );
};

const MarketplaceApp = () => {
  const fetch = useFetch();
  const apiFetch = useApiFetch();
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const { address, sendTransaction, signMessage, signTypedData } = useMarketplaceWallet(id);
  useAutoConnectWallet();

  const { data: securityReports, isLoading: isSecurityReportsLoading } = useSecurityReports();

  const query = useQuery<unknown, ResourceError<unknown>, MarketplaceAppOverview>({
    queryKey: [ 'marketplace-dapps', id ],
    queryFn: async() => {
      if (!feature.isEnabled) {
        return null;
      } else if ('configUrl' in feature) {
        const result = await fetch<Array<MarketplaceAppOverview>, unknown>(feature.configUrl, undefined, { resource: 'marketplace-dapps' });
        if (!Array.isArray(result)) {
          throw result;
        }
        const item = result.find((app: MarketplaceAppOverview) => app.id === id);
        if (!item) {
          throw { status: 404 };
        }
        return item;
      } else {
        return apiFetch('admin:marketplace_dapp', { pathParams: { chainId: config.chain.id, dappId: id } });
      }
    },
    enabled: feature.isEnabled,
  });
  const { data, isPending } = query;
  const { setIsAutoConnectDisabled } = useMarketplaceContext();

  const appUrl = useMemo(() => getAppUrl(data?.url, router), [ data?.url, router ]);

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
        isLoading={ isPending || isSecurityReportsLoading }
        securityReport={ securityReports?.[id] }
      />
      <DappscoutIframeProvider
        address={ address }
        appUrl={ appUrl }
        rpcUrl={ config.chain.rpcUrls[0] }
        sendTransaction={ sendTransaction }
        signMessage={ signMessage }
        signTypedData={ signTypedData }
      >
        <MarketplaceAppContent address={ address } data={ data } isPending={ isPending } appUrl={ appUrl }/>
      </DappscoutIframeProvider>
    </Flex>
  );
};

export default MarketplaceApp;
