import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends FeaturedNetwork {
  isActive?: boolean;
  isMobile?: boolean;
}

const NetworkMenuLink = ({ title, icon, isActive: isActiveProp, isMobile, url, invertIconInDarkMode }: Props) => {
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const style = useColorModeValue({}, invertIconInDarkMode ? darkModeFilter : {});

  const iconEl = icon ? (
    <Image w="30px" h="30px" src={ icon } alt={ `${ title } network icon` } style={ style }/>
  ) : (
    <IconSvg
      name="networks/icon-placeholder"
      boxSize="30px"
      color={{ base: 'blackAlpha.100', _dark: 'whiteAlpha.300' }}
    />
  );

  const isActive = (() => {
    if (isActiveProp !== undefined) {
      return isActiveProp;
    }

    try {
      const itemOrigin = new URL(url).origin;
      const currentOrigin = window.location.origin;

      return itemOrigin === currentOrigin;
    } catch (error) {
      return false;
    }
  })();

  return (
    <Box as="li" listStyleType="none">
      <chakra.a
        display="flex"
        href={ url }
        px={ 3 }
        py="9px"
        alignItems="center"
        cursor="pointer"
        pointerEvents={ isActive ? 'none' : 'initial' }
        borderRadius="base"
        color={ isActive ? { base: 'blackAlpha.900', _dark: 'whiteAlpha.900' } : { base: 'gray.600', _dark: 'gray.400' } }
        bgColor={ isActive ? { base: 'blue.50', _dark: 'whiteAlpha.100' } : 'transparent' }
        _hover={{ color: isActive ? { base: 'blackAlpha.900', _dark: 'whiteAlpha.900' } : 'link.primary.hover' }}
      >
        { iconEl }
        <Text
          marginLeft={ 3 }
          fontWeight="500"
          color="inherit"
          fontSize={ isMobile ? 'sm' : 'md' }
          lineHeight={ isMobile ? '20px' : '24px' }
        >
          { title }
        </Text>
        { isActive && (
          <IconSvg
            name="check"
            boxSize="24px"
            marginLeft="auto"
          />
        ) }
      </chakra.a>
    </Box>
  );
};

export default React.memo(NetworkMenuLink);
