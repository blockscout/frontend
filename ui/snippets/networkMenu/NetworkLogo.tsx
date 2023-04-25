import { Icon, Box, Image, useColorModeValue, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import appConfig from 'configs/app/config';
import iconPlaceholder from 'icons/networks/icon-placeholder.svg';
import logoPlaceholder from 'icons/networks/logo-placeholder.svg';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const field = isSmall ? 'icon' : 'logo';
  const logoColor = useColorModeValue('blue.600', 'white');

  const display = isSmall ? {
    base: 'none',
    lg: isCollapsed === false ? 'none' : 'block',
    xl: isCollapsed ? 'block' : 'none',
  } : {
    base: 'block',
    lg: isCollapsed === false ? 'block' : 'none',
    xl: isCollapsed ? 'none' : 'block',
  };

  if (appConfig.network[field].default) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    <Icon
      as={ isSmall ? iconPlaceholder : logoPlaceholder }
      width="auto"
      height="100%"
      color={ logoColor }
      display={ display }
    />
  );
};

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {

  const logoSrc = useColorModeValue(appConfig.network.logo.default, appConfig.network.logo.dark || appConfig.network.logo.default);
  const iconSrc = useColorModeValue(appConfig.network.icon.default, appConfig.network.icon.dark || appConfig.network.icon.default);
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue({}, !appConfig.network.logo.dark ? darkModeFilter : {});
  const iconStyle = useColorModeValue({}, !appConfig.network.icon.dark ? darkModeFilter : {});

  return (
    // TODO switch to <NextLink href={ href } passHref> when main page for network will be ready
    <Box
      as="a"
      href={ route({ pathname: '/' }) }
      width={{ base: 'auto', lg: isCollapsed === false ? '120px' : '30px', xl: isCollapsed ? '30px' : '120px' }}
      height={{ base: '20px', lg: isCollapsed === false ? '20px' : '30px', xl: isCollapsed ? '30px' : '20px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      <Image
        w="auto"
        h="100%"
        src={ logoSrc }
        alt={ `${ appConfig.network.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed }/> }
        display={{ base: 'block', lg: isCollapsed === false ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
        style={ logoStyle }
      />
      { /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src={ iconSrc }
        alt={ `${ appConfig.network.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
        style={ iconStyle }
      />
    </Box>
  );
};

export default React.memo(NetworkLogo);
