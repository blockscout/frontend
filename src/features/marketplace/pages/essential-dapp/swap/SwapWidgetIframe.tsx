// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Center, Text, chakra } from '@chakra-ui/react';
import { LiFiWidgetLight, useWidgetLightEvents, WidgetLightEvent, type WidgetLightIframeProps } from '@lifi/widget-light';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'src/toolkit/chakra/button';
import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

import { SWAP_WIDGET_LOAD_TIMEOUT, SWAP_WIDGET_MIN_HEIGHT } from './consts';

const StyledLiFiWidget = chakra(LiFiWidgetLight);

type Props = Pick<WidgetLightIframeProps, 'config' | 'handlers' | 'onConnect'>;

export default function SwapWidgetIframe(props: Props) {
  const { colorMode } = useColorMode();
  const [ status, setStatus ] = useState<'loading' | 'ready' | 'error'>('loading');
  const [ attempt, setAttempt ] = useState(0);
  const events = useWidgetLightEvents();

  useEffect(() => {
    const timeout = window.setTimeout(() => setStatus('error'), SWAP_WIDGET_LOAD_TIMEOUT);
    // READY only starts configuration; PageEntered means the configured widget has rendered.
    const handleReady = () => {
      window.clearTimeout(timeout);
      setStatus('ready');
    };
    events.on(WidgetLightEvent.PageEntered, handleReady);
    return () => {
      window.clearTimeout(timeout);
      events.off(WidgetLightEvent.PageEntered, handleReady);
    };
  }, [ events, attempt ]);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return (
    <Box position="relative" minH={ SWAP_WIDGET_MIN_HEIGHT } bg="bg.primary" aria-busy={ status === 'loading' }>
      { status !== 'error' && (
        <StyledLiFiWidget
          { ...props }
          key={ attempt }
          autoResize
          w="full"
          minH={ SWAP_WIDGET_MIN_HEIGHT }
          display="block"
          visibility={ status === 'ready' ? 'visible' : 'hidden' }
          css={{
            colorScheme: colorMode,
            // LI.FI reports body.offsetHeight, which excludes the hosted page's 8px top and bottom margins.
            '--lifi-iframe-height-offset': '16px',
          }}
        />
      ) }
      { status === 'loading' && <Center position="absolute" inset={ 0 }><ContentLoader/></Center> }
      { status === 'error' && (
        <Center position="absolute" inset={ 0 } flexDir="column" gap={ 4 }>
          <Text role="alert">Unable to load the swap widget. Please try again.</Text>
          <Button onClick={ handleRetry }>Try again</Button>
        </Center>
      ) }
    </Box>
  );
}
