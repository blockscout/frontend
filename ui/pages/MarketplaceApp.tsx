import { Box, Center, useColorMode } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { AppItemOverview } from 'types/client/apps';

import useNetwork from 'lib/hooks/useNetwork';
import Page from 'ui/shared/Page/Page';

type Props = {
  app?: AppItemOverview;
  isLoading: boolean;
}

const MarketplaceApp = ({ app, isLoading }: Props) => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(isLoading);
  const ref = useRef<HTMLIFrameElement>(null);
  const { colorMode } = useColorMode();
  const network = useNetwork();

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const sandboxAttributeValue = 'allow-forms allow-orientation-lock ' +
        'allow-pointer-lock allow-popups-to-escape-sandbox ' +
        'allow-same-origin allow-scripts ' +
        'allow-top-navigation-by-user-activation';

  useEffect(() => {
    if (app && !isFrameLoading) {
      ref?.current?.contentWindow?.postMessage({ blockscoutColorMode: colorMode, blockscoutChainId: network?.chainId }, app.url);
    }
  }, [ isFrameLoading, app, colorMode, network, ref ]);

  return (
    <Page wrapChildren={ false }>
      <Center
        as="main"
        h="100%"
        paddingTop={{ base: '138px', lg: 0 }}
      >
        { (isFrameLoading) && (
          <Center
            h="100%"
            w="100%"
          >
            Loading...
          </Center>
        ) }

        { app && (
          <Box
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
