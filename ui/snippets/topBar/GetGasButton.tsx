import { Image, Box } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

const getGasFeature = config.features.getGasButton;

const GetGasButton = () => {
  const isMobile = useIsMobile(false);

  const onGetGasClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Get gas', Source: 'address' });
  }, []);

  if (getGasFeature.isEnabled && !isMobile) {
    try {
      const dappId = getGasFeature.dappId;
      const urlObj = new URL(getGasFeature.url);

      urlObj.searchParams.append('utm_source', 'blockscout');
      urlObj.searchParams.append('utm_medium', 'address');

      const url = urlObj.toString();
      const isInternal = typeof dappId === 'string';

      const Link = isInternal ? LinkInternal : LinkExternal;
      const href = isInternal ? route({ pathname: '/apps/[id]', query: { id: dappId, url } }) : url;

      return (
        <>
          <Box h="1px" w="8px" bg="divider" mx={ 1 }/>
          <Link
            href={ href }
            display="flex"
            alignItems="center"
            fontSize="xs"
            lineHeight={ 5 }
            onClick={ onGetGasClick }
          >
            { getGasFeature.logoUrl && (
              <Image
                src={ getGasFeature.logoUrl }
                alt={ getGasFeature.name }
                boxSize="14px"
                mr={ 1 }
              />
            ) }
            { getGasFeature.name }
          </Link>
        </>
      );
    } catch (error) {}
  }

  return null;
};

export default GetGasButton;
