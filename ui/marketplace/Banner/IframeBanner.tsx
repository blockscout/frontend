import { Link, Skeleton, Box } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import * as mixpanel from 'lib/mixpanel/index';

const IframeBanner = ({ contentUrl, linkUrl }: { contentUrl: string; linkUrl: string }) => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PROMO_BANNER, { Source: 'Marketplace', Link: linkUrl });
  }, [ linkUrl ]);

  return (
    <Skeleton
      isLoaded={ !isFrameLoading }
      position="relative"
      h="136px"
      w="100%"
      borderRadius="md"
      mb={{ base: 0, sm: 2 }}
      mt={ 6 }
      overflow="hidden"
    >
      <Link
        href={ linkUrl }
        target="_blank"
        rel="noopener noreferrer"
        onClick={ handleClick }
        position="absolute"
        w="100%"
        h="100%"
        top={ 0 }
        left={ 0 }
        zIndex={ 1 }
      />
      <Box
        as="iframe"
        h="100%"
        w="100%"
        src={ contentUrl }
        title="Marketplace banner"
        onLoad={ handleIframeLoad }
      />
    </Skeleton>
  );
};

export default IframeBanner;
