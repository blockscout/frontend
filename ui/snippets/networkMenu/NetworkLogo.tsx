import {
  Box,
  Image,
  useColorMode,
  useColorModeValue,
  Skeleton,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const LogoFallback = ({
  isCollapsed,
  isSmall,
}: {
  isCollapsed?: boolean;
  isSmall?: boolean;
}) => {
  const field = isSmall ? 'icon' : 'logo';
  const { colorMode } = useColorMode();

  const iconPath =
    colorMode === 'light' ? 'networks/wvm-icon-dark' : 'networks/wvm-icon-dark';

  const logoPath =
    colorMode === 'light' ?
      'networks/wvm-logo-dark-2' :
      'networks/wvm-logo-light';

  const display = isSmall ?
    {
      base: 'none',
      lg: isCollapsed === false ? 'none' : 'block',
      xl: isCollapsed ? 'block' : 'none',
    } :
    {
      base: 'block',
      lg: isCollapsed === false ? 'block' : 'none',
      xl: isCollapsed ? 'none' : 'block',
    };

  if (config.UI.sidebar[field].default) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    <IconSvg
      name={ isSmall ? `${ iconPath }` : `${ logoPath }` }
      width="auto"
      height="100%"
      color={ colorMode === 'dark' ? 'whiteAlpha.400' : 'blackAlpha.400' }
      display={ display }
    />
  );
};

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {
  const logoSrc = useColorModeValue(
    config.UI.sidebar.logo.default,
    config.UI.sidebar.logo.dark || config.UI.sidebar.logo.default,
  );

  const iconSrc = useColorModeValue(
    config.UI.sidebar.icon.default,
    config.UI.sidebar.icon.dark || config.UI.sidebar.icon.default,
  );
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue(
    {},
    !config.UI.sidebar.logo.dark ? darkModeFilter : {},
  );
  const iconStyle = useColorModeValue(
    {},
    !config.UI.sidebar.icon.dark ? darkModeFilter : {},
  );

  return (
    <Box
      className={ className }
      as="a"
      href={ route({ pathname: '/' }) }
      width={{
        base: '120px',
        lg: isCollapsed === false ? '120px' : '30px',
        xl: isCollapsed ? '30px' : '120px',
      }}
      height={{
        base: '24px',
        lg: isCollapsed === false ? '24px' : '30px',
        xl: isCollapsed ? '30px' : '24px',
      }}
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
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed }/> }
        display={{
          base: 'block',
          lg: isCollapsed === false ? 'block' : 'none',
          xl: isCollapsed ? 'none' : 'block',
        }}
        style={ logoStyle }
      />
      { /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src={ iconSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        display={{
          base: 'none',
          lg: isCollapsed === false ? 'none' : 'block',
          xl: isCollapsed ? 'block' : 'none',
        }}
        style={ iconStyle }
      />
    </Box>
  );
};

export default React.memo(chakra(NetworkLogo));
