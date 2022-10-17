import { Box, Center, useColorMode } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { AppItemOverview } from 'types/client/apps';

import appConfig from 'configs/app/config';
import link from 'lib/link/link';
import ContentLoader from 'ui/shared/ContentLoader';
import Page from 'ui/shared/Page/Page';

type Props = {
  app?: AppItemOverview;
  isLoading: boolean;
}

const MarketplaceApp = ({ app, isLoading }: Props) => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(isLoading);
  const ref = useRef<HTMLIFrameElement>(null);
  const { colorMode } = useColorMode();

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const sandboxAttributeValue = 'allow-forms allow-orientation-lock ' +
        'allow-pointer-lock allow-popups-to-escape-sandbox ' +
        'allow-same-origin allow-scripts ' +
        'allow-top-navigation-by-user-activation allow-popups';

  const allowAttributeValue = 'clipboard-read; clipboard-write;';

  useEffect(() => {
    if (app && !isFrameLoading) {
      ref?.current?.contentWindow?.postMessage({
        blockscoutColorMode: colorMode,
        blockscoutChainId: Number(appConfig.network.id),
        blockscoutAddressExplorerUrl: link('address_index'),
        blockscoutTransactionExplorerUrl: link('tx'),
      }, app.url);
    }
  }, [ isFrameLoading, app, colorMode, ref ]);

  return (
    <Page wrapChildren={ false }>
      <Center
        as="main"
        h="100vh"
        paddingTop={{ base: '138px', lg: 0 }}
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
