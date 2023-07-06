import { Box, Center, useColorMode } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import { useAppContext } from 'lib/contexts/app';
import useApiFetch from 'lib/hooks/useFetch';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

const MarketplaceApp = () => {
  const ref = useRef<HTMLIFrameElement>(null);

  const apiFetch = useApiFetch();
  const appProps = useAppContext();
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const { isLoading, isError, error, data } = useQuery<unknown, ResourceError<unknown>, MarketplaceAppOverview>(
    [ 'marketplace-apps', id ],
    async() => {
      const result = await apiFetch<Array<MarketplaceAppOverview>, unknown>(appConfig.marketplaceConfigUrl || '');
      if (!Array.isArray(result)) {
        throw result;
      }

      const item = result.find((app: MarketplaceAppOverview) => app.id === id);
      if (!item) {
        throw { status: 404 };
      }

      return item;
    },
  );

  const [ isFrameLoading, setIsFrameLoading ] = useState(isLoading);
  const { colorMode } = useColorMode();

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  useEffect(() => {
    if (data && !isFrameLoading) {
      const message = {
        blockscoutColorMode: colorMode,
        blockscoutRootUrl: appConfig.baseUrl + route({ pathname: '/' }),
        blockscoutAddressExplorerUrl: appConfig.baseUrl + route({ pathname: '/address/[hash]', query: { hash: '' } }),
        blockscoutTransactionExplorerUrl: appConfig.baseUrl + route({ pathname: '/tx/[hash]', query: { hash: '' } }),
        blockscoutNetworkName: appConfig.network.name,
        blockscoutNetworkId: Number(appConfig.network.id),
        blockscoutNetworkCurrency: appConfig.network.currency,
        blockscoutNetworkRpc: appConfig.network.rpcUrl,
      };

      ref?.current?.contentWindow?.postMessage(message, data.url);
    }
  }, [ isFrameLoading, data, colorMode, ref ]);

  if (isError) {
    throw new Error('Unable to load app', { cause: error });
  }

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer.includes('/apps');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to marketplace',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      { !isLoading && <PageTitle title={ data.title } px={{ base: 4, lg: 12 }} pt={{ base: '138px', lg: 0 }} backLink={ backLink }/> }
      <Center
        as="main"
        h="100vh"
      >
        { (isFrameLoading) && (
          <ContentLoader/>
        ) }

        { data && (
          <Box
            allow={ IFRAME_ALLOW_ATTRIBUTE }
            ref={ ref }
            sandbox={ IFRAME_SANDBOX_ATTRIBUTE }
            as="iframe"
            h="100%"
            w="100%"
            display={ isFrameLoading ? 'none' : 'block' }
            src={ data.url }
            title={ data.title }
            onLoad={ handleIframeLoad }
          />
        ) }
      </Center>
    </>
  );
};

export default MarketplaceApp;
