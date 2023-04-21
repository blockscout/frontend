import { Icon, Box, Image, useColorModeValue, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import appConfig from 'configs/app/config';
import ASSETS from 'lib/networks/networkAssets';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const type = appConfig.network.type || 'fallback' as const;

  const field = isSmall ? 'smallLogo' : 'logo';
  const fieldDark = isSmall ? 'smallLogoDark' : 'logoDark';
  const logo = useColorModeValue(ASSETS[type][field], ASSETS[type][fieldDark]);
  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });
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

  if (appConfig.network[field]) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    <Icon
      as={ logo || ASSETS[type][field] }
      width="auto"
      height="100%"
      color={ type === 'fallback' ? logoColor : undefined }
      display={ display }
      style={ logo ? undefined : style }
    />
  );
};

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {

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
        src={ appConfig.network.logo }
        display={{ base: 'block', lg: isCollapsed === false ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
        alt={ `${ appConfig.network.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed }/> }
      />
      { /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src={ appConfig.network.smallLogo }
        display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
        alt={ `${ appConfig.network.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
      />
    </Box>
  );
};

export default React.memo(NetworkLogo);
