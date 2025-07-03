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
    <Image w="20px" h="20px" src={ icon } alt={ `${ title } network icon` } style={ style }/>
  ) : (
    <IconSvg
      name="networks/icon-placeholder"
      boxSize="20px"
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
        target="_blank"
        px={ 2 }
        py="5px"
        opacity={ isActive ? 0.6 : 1 }
        alignItems="center"
        cursor="pointer"
        pointerEvents={ isActive ? 'none' : 'initial' }
        borderRadius="base"
        _hover={{ color: isActive ? 'text.primary' : 'link.primary.hover' }}
        css={{
          '&:hover .external-arrow': {
            display: 'inline-flex',
          },
        }}
      >
        { iconEl }
        <Text
          marginLeft={ 2 }
          color="inherit"
          fontSize={ isMobile ? 'sm' : 'md' }
          lineHeight={ isMobile ? '20px' : '24px' }
        >
          { title }
        </Text>
        { isActive ? (
          <IconSvg
            name="check"
            boxSize="20px"
            marginLeft="auto"
          />
        ) : (
          <Box
            className="external-arrow"
            display="none"
            marginLeft="auto"
          >
            <IconSvg
              name="arrows/north-east"
              boxSize="20px"
            />
          </Box>
        ) }
      </chakra.a>
    </Box>
  );
};

export default React.memo(NetworkMenuLink);
