import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {

  const logoSrc = useColorModeValue('var(--kda-icons-brands-kadena-logo-light)', 'var(--kda-icons-brands-kadena-logo-dark)');
  const iconSrc = useColorModeValue('var(--kda-icons-brands-kadena-rounded-green)', 'var(--kda-icons-brands-kadena-rounded-white)');

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      width={{ base: '140px', lg: isCollapsed === false ? '140px' : '40px', xl: isCollapsed ? '40px' : '140px' }}
      height={{ base: '40px', lg: isCollapsed === false ? '40px' : '40px', xl: isCollapsed ? '40px' : '40px' }}
      display="inline-flex"
      overflow="hidden"
      position="relative"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      <chakra.div
        as="image"
        background={ logoSrc }
        width="140px"
        height="40px"
        position="absolute"
        top={ 0 }
        left={ 0 }
        opacity={{ base: 1, lg: isCollapsed === false ? 1 : 0, xl: isCollapsed ? 0 : 1 }}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="left center"
        backgroundColor="transparent"
        transition="opacity 2s ease-in-out"
      />
      { /* small logo */ }
      <chakra.div
        as="image"
        background={ iconSrc }
        width="48px"
        height="48px"
        position="absolute"
        top="-4px"
        left="-3px"
        opacity={{ base: 0, lg: isCollapsed === false ? 0 : 1, xl: isCollapsed ? 1 : 0 }}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="left center"
        backgroundColor="transparent"
        transition="opacity 2s ease-in-out"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
