// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Center, chakra } from '@chakra-ui/react';
import { LiFiWidgetLight, useWidgetLightEvents, WidgetLightEvent, type WidgetLightIframeProps } from '@lifi/widget-light';
import React, { useEffect, useState } from 'react';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

const StyledLiFiWidget = chakra(LiFiWidgetLight);

type Props = Pick<WidgetLightIframeProps, 'config' | 'handlers' | 'onConnect'>;

export default function SwapWidgetIframe(props: Props) {
  const { colorMode } = useColorMode();
  const [ isReady, setIsReady ] = useState(false);
  const events = useWidgetLightEvents();

  useEffect(() => {
    // READY only starts configuration; PageEntered means the configured widget has rendered.
    const handleReady = () => setIsReady(true);
    events.on(WidgetLightEvent.PageEntered, handleReady);
    return () => events.off(WidgetLightEvent.PageEntered, handleReady);
  }, [ events ]);

  return (
    <Box position="relative" minH="500px" bg="bg.primary" aria-busy={ !isReady }>
      <StyledLiFiWidget
        { ...props }
        autoResize
        w="full"
        minH="500px"
        display="block"
        visibility={ isReady ? 'visible' : 'hidden' }
        css={{
          colorScheme: colorMode,
          // LI.FI reports body.offsetHeight, which excludes the hosted page's 8px top and bottom margins.
          '--lifi-iframe-height-offset': '16px',
        }}
      />
      { !isReady && <Center position="absolute" inset={ 0 }><ContentLoader/></Center> }
    </Box>
  );
}
