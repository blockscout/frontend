import { Box, Image, useColorModeValue, Skeleton, chakra } from '@chakra-ui/react';
import LogoBig from 'public/icons/blessnet/logo-big.svg';
import LogoSmall from 'public/icons/blessnet/logo-small.svg';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const field = isSmall ? 'icon' : 'logo';
  const logoColor = useColorModeValue('blue.600', 'white');

  const display = isSmall ? {
    base: 'none',
    lg: !isCollapsed ? 'none' : 'block',
    xl: isCollapsed ? 'block' : 'none',
  } : {
    base: 'block',
    lg: !isCollapsed ? 'block' : 'none',
    xl: isCollapsed ? 'none' : 'block',
  };

  if (config.UI.navigation[field].default) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    isCollapsed ?
      <LogoSmall width={ 220 } height={ 24 } fill={ logoColor }/> :
      <LogoBig width={ 330 } height={ 24 } fill={ logoColor }/>
  );
};

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {

  const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue({}, !config.UI.navigation.logo.dark ? darkModeFilter : {});

  return (
    <Box
      className={ className }
      as="a"
      href={ route({ pathname: '/' }) }
      width={{ base: '120px', lg: isCollapsed === false ? '120px' : '30px', xl: isCollapsed ? '30px' : '120px' }}
      height={{ base: '24px', lg: isCollapsed === false ? '24px' : '30px', xl: isCollapsed ? '30px' : '24px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >

      <Image
        w="auto"
        h="100%"
        src={ logoSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed }/> }
        display={{ base: 'block', lg: !isCollapsed ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
        style={ logoStyle }
      />

    </Box>
  );
};

export default React.memo(chakra(NetworkLogo));
