import { Box, Image, useColorModeValue, Skeleton, chakra } from '@chakra-ui/react';
import Images from 'next/image';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
// import IconSvg from 'ui/shared/IconSvg';

import mocaIcon from '../../../icons/logo/icon-moca-placeholder.png';
import mocaLogo from '../../../icons/logo/logo-moca-placeholder.png';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const field = isSmall ? 'icon' : 'logo';
  // const logoColor = useColorModeValue('blue.600', 'white');

  const display = isSmall ? {
    base: 'none',
    lg: isCollapsed === false ? 'none' : 'block',
    xl: isCollapsed ? 'block' : 'none',
  } : {
    base: 'block',
    lg: isCollapsed === false ? 'block' : 'none',
    xl: isCollapsed ? 'none' : 'block',
  };

  if (config.UI.navigation[field].default) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    <Images src={ isCollapsed ? mocaIcon : mocaLogo } alt="Moca Icon" style={{ width: '100%', height: '100%' }}/>
    // <IconSvg
    //   name={ isSmall ? 'icon-moca-placeholder' : 'logo-moca-placeholder' }
    //   width="auto"
    //   height="100%"
    //   display={ display }
    // />
  );
};

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {

  // const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);
  const iconSrc = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  // const logoStyle = useColorModeValue({}, !config.UI.navigation.logo.dark ? darkModeFilter : {});
  const iconStyle = useColorModeValue({}, !config.UI.navigation.icon.dark ? darkModeFilter : {});

  return (
    <Box
      className={ className }
      as="a"
      href={ route({ pathname: '/' }) }
      width={{ base: '194px', lg: isCollapsed === false ? '194px' : '30px', xl: isCollapsed ? '30px' : '194px' }}
      height={{ base: '38px', lg: isCollapsed === false ? '38px' : '30px', xl: isCollapsed ? '30px' : '38px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      { /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src={ iconSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
        style={ iconStyle }
      />
    </Box>
  );
};

export default React.memo(chakra(NetworkLogo));
