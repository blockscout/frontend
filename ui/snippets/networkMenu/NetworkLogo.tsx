import { Icon, Box, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import smallLogoPlaceholder from 'icons/networks/icons/placeholder.svg';
import logoPlaceholder from 'icons/networks/logos/blockscout.svg';
import link from 'lib/link/link';
import ASSETS from 'lib/networks/networkAssets';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const href = link('network_index');
  const [ isLogoError, setLogoError ] = React.useState(false);
  const [ isSmallLogoError, setSmallLogoError ] = React.useState(false);

  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });

  const handleSmallLogoError = React.useCallback(() => {
    setSmallLogoError(true);
  }, []);

  const handleLogoError = React.useCallback(() => {
    setLogoError(true);
  }, []);

  const logoEl = (() => {
    const fallbackLogoSrc = appConfig.network.type ? ASSETS[appConfig.network.type]?.logo : undefined;
    const fallbackSmallLogoSrc = appConfig.network.type ? ASSETS[appConfig.network.type]?.smallLogo || ASSETS[appConfig.network.type]?.icon : undefined;

    const logo = appConfig.network.logo;
    const smallLogo = appConfig.network.smallLogo;

    const fallbackLogo = (
      <Icon
        as={ fallbackLogoSrc || logoPlaceholder }
        width="auto"
        height="100%"
        color={ fallbackLogoSrc ? undefined : logoColor }
        display={{ base: 'block', lg: isCollapsed === false ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
        style={ style }
      />
    );
    const fallbackSmallLogo = (
      <Icon
        as={ fallbackSmallLogoSrc || smallLogoPlaceholder }
        width="auto"
        height="100%"
        color={ fallbackSmallLogoSrc ? undefined : logoColor }
        display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
        style={ style }
      />
    );

    return (
      <>
        { /* big logo */ }
        <Image
          w="auto"
          h="100%"
          src={ logo }
          display={{ base: 'block', lg: isCollapsed === false ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
          alt={ `${ appConfig.network.name } network logo` }
          fallback={ isLogoError || !logo ? fallbackLogo : undefined }
          onError={ handleLogoError }
        />
        { /* small logo */ }
        <Image
          w="auto"
          h="100%"
          src={ smallLogo }
          display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
          alt={ `${ appConfig.network.name } network logo` }
          fallback={ isSmallLogoError || !smallLogo ? fallbackSmallLogo : undefined }
          onError={ handleSmallLogoError }
        />
      </>
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
      aria-label="Link to main page"
    >
      { logoEl }
    </Box>
  );
};

export default React.memo(NetworkLogo);
