import { Box, Center, useColorMode } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { JsonRpcUrlResponse } from 'types/api/json-rpc-url';
import type { AppItemOverview } from 'types/client/apps';

import appConfig from 'configs/app/config';
import useFetch from 'lib/hooks/useFetch';
import link from 'lib/link/link';
import ContentLoader from 'ui/shared/ContentLoader';
import Page from 'ui/shared/Page/Page';

type Props = {
  app?: AppItemOverview;
  isLoading: boolean;
}

const MarketplaceApp = ({ app, isLoading }: Props) => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(isLoading);
  const { colorMode } = useColorMode();
  const fetch = useFetch();
  const ref = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const { data: jsonRpcUrlResponse } = useQuery<unknown, unknown, JsonRpcUrlResponse>(
    [ 'json-rpc-url' ],
    async() => await fetch(`/api/config/json-rpc-url`),
    { refetchOnMount: false },
  );

  useEffect(() => {
    if (app && !isFrameLoading) {
      const message = {
        blockscoutColorMode: colorMode,
        blockscoutRootUrl: link('network_index'),
        blockscoutAddressExplorerUrl: link('address_index'),
        blockscoutTransactionExplorerUrl: link('tx'),
        blockscoutNetworkName: appConfig.network.name,
        blockscoutNetworkId: Number(appConfig.network.id),
        blockscoutNetworkCurrency: appConfig.network.currency,
        blockscoutNetworkRpc: jsonRpcUrlResponse?.json_rpc_url,
      };

      ref?.current?.contentWindow?.postMessage(message, app.url);
    }
  }, [ isFrameLoading, app, colorMode, ref, jsonRpcUrlResponse ]);

  const sandboxAttributeValue = 'allow-forms allow-orientation-lock ' +
      'allow-pointer-lock allow-popups-to-escape-sandbox ' +
      'allow-same-origin allow-scripts ' +
      'allow-top-navigation-by-user-activation allow-popups';

  const allowAttributeValue = 'clipboard-read; clipboard-write;';

  return (
    <Page wrapChildren={ false }>
      <Center
        as="main"
        h="100vh"
        pt={{ base: '138px', lg: 0 }}
        pb={{ base: 0, lg: 10 }}
      >
        { (isFrameLoading) && (
          <ContentLoader/>
        ) }

        { app && (
          <Box
            allow={ allowAttributeValue }
            ref={ ref }
            sandbox={ sandboxAttributeValue }
            as="iframe"
            h="100%"
            w="100%"
            display={ isFrameLoading ? 'none' : 'block' }
            src={ app.url }
            title={ app.title }
            onLoad={ handleIframeLoad }
          />
        ) }
      </Center>
    </Page>
  );
};

export default MarketplaceApp;
