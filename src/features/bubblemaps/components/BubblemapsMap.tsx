// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Center, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';

import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

const feature = config.features.bubblemaps;

// fixed on every viewport, per https://docs.bubblemaps.io/iframe/quickstart (600px minimum)
const MAP_HEIGHT = '700px';

interface Props {
  hash: string;
  isLoading: boolean;
}

const BubblemapsMap = ({ hash, isLoading }: Props) => {
  const [ isFrameLoading, setIsFrameLoading ] = React.useState(true);

  const handleIframeLoad = React.useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  const url = new URL('https://iframe.bubblemaps.io/map');
  url.searchParams.set('address', hash);
  url.searchParams.set('chain', feature.chainSlug);
  url.searchParams.set('partnerId', feature.partnerId);

  return (
    <Box
      h={ MAP_HEIGHT }
      w="100%"
      borderWidth="1px"
      borderColor="border.divider"
      borderRadius="base"
      overflow="hidden"
    >
      { (isLoading || isFrameLoading) && (
        <Center h="100%">
          <ContentLoader/>
        </Center>
      ) }
      { !isLoading && (
        <chakra.iframe
          src={ url.toString() }
          title="Bubblemaps"
          allow="clipboard-write"
          w="100%"
          h="100%"
          border="none"
          display={ isFrameLoading ? 'none' : 'block' }
          onLoad={ handleIframeLoad }
        />
      ) }
    </Box>
  );
};

export default React.memo(BubblemapsMap);
