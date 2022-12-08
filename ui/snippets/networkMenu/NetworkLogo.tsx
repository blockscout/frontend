import { Icon, Box, Image, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import smallLogoPlaceholder from 'icons/networks/icons/placeholder.svg';
import logoPlaceholder from 'icons/networks/logos/blockscout.svg';
import link from 'lib/link/link';
import ASSETS from 'lib/networks/networkAssets';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const href = link('network_index');

  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });
  const isLg = useBreakpointValue({ base: false, lg: true, xl: false }, { ssr: true });

  const logoEl = (() => {
    const showSmallLogo = isCollapsed || (isCollapsed !== false && isLg);
    if (showSmallLogo) {
      if (appConfig.network.smallLogo) {
        return (
          <Image
            w="auto"
            h="100%"
            src={ appConfig.network.smallLogo }
            alt={ `${ appConfig.network.name } network logo` }
          />
        );
      }

      const smallLogo = appConfig.network.type ? ASSETS[appConfig.network.type]?.smallLogo || ASSETS[appConfig.network.type]?.icon : undefined;
      return (
        <Icon
          as={ smallLogo || smallLogoPlaceholder }
          width="auto"
          height="100%"
          color={ smallLogo ? undefined : logoColor }
          { ...getDefaultTransitionProps() }
          style={ style }
        />
      );
    }

    if (appConfig.network.logo) {
      return (
        <Image
          w="auto"
          h="100%"
          src={ appConfig.network.logo }
          alt={ `${ appConfig.network.name } network logo` }
        />
      );
    }

    const logo = appConfig.network.type ? ASSETS[appConfig.network.type]?.logo : undefined;
    return (
      <Icon
        as={ logo || logoPlaceholder }
        width="auto"
        height="100%"
        color={ logo ? undefined : logoColor }
        { ...getDefaultTransitionProps() }
        style={ style }
      />
    );
  })();

  return (
    // TODO switch to <NextLink href={ href } passHref> when main page for network will be ready
    <Box
      as="a"
      href={ href }
      width={{ base: 'auto', lg: isCollapsed === false ? '113px' : '30px', xl: isCollapsed ? '30px' : '113px' }}
      height={{ base: '20px', lg: isCollapsed === false ? '20px' : '30px', xl: isCollapsed ? '30px' : '20px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
      aria-label="Link to main page"
    >
      { logoEl }
    </Box>
  );
};

export default React.memo(NetworkLogo);
