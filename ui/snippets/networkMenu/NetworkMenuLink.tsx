import { Box, Flex, Text, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';

import IconSvg from 'ui/shared/IconSvg';

import useColors from './useColors';

interface Props extends FeaturedNetwork {
  isActive?: boolean;
  isMobile?: boolean;
}

const NetworkMenuLink = ({ title, icon, isActive, isMobile, url, invertIconInDarkMode }: Props) => {
  const colors = useColors();
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const style = useColorModeValue({}, invertIconInDarkMode ? darkModeFilter : {});

  const iconEl = icon ? (
    <Image w="30px" h="30px" src={ icon } alt={ `${ title } network icon` } style={ style }/>
  ) : (
    <IconSvg
      name="networks/icon-placeholder"
      boxSize="30px"
      color={ colors.iconPlaceholder.default }
    />
  );

  return (
    <Box as="li" listStyleType="none">
      <Flex
        as="a"
        // eslint-disable-next-line no-constant-binary-expression
        href={ 'https://review-fe-2246.k8s-dev.blockscout.com/' || url }
        px={ 3 }
        py="9px"
        alignItems="center"
        cursor="pointer"
        pointerEvents={ isActive ? 'none' : 'initial' }
        borderRadius="base"
        color={ isActive ? colors.text.active : colors.text.default }
        bgColor={ isActive ? colors.bg.active : colors.bg.default }
        _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        target="_blank"
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
      </Flex>
    </Box>
  );
};

export default React.memo(NetworkMenuLink);
