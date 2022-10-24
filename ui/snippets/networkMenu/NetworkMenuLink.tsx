import { Box, Flex, Icon, Text, Image } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';

import checkIcon from 'icons/check.svg';
import placeholderIcon from 'icons/networks/icons/placeholder.svg';

import useColors from './useColors';

interface Props extends FeaturedNetwork {
  isActive: boolean;
  isMobile?: boolean;
  url: string;
}

const NetworkMenuLink = ({ title, icon, isActive, isMobile, url }: Props) => {
  const hasIcon = Boolean(icon);
  const colors = useColors({ hasIcon });

  const iconEl = typeof icon === 'string' ? (
    <Image w="30px" h="30px" src={ icon } alt={ `${ title } network icon` }/>
  ) : (
    <Icon
      as={ hasIcon ? icon : placeholderIcon }
      boxSize="30px"
      color={ isActive ? colors.icon.active : colors.icon.default }
    />
  );

  return (
    <Box as="li" listStyleType="none">
      <Flex
        as="a"
        href={ url }
        px={ isMobile ? 3 : 4 }
        py={ 2 }
        alignItems="center"
        cursor="pointer"
        pointerEvents={ isActive ? 'none' : 'initial' }
        borderRadius="base"
        color={ isActive ? colors.text.active : colors.text.default }
        bgColor={ isActive ? colors.bg.active : colors.bg.default }
        _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
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
          <Icon
            as={ checkIcon }
            boxSize="24px"
            marginLeft="auto"
          />
        ) }
      </Flex>
    </Box>
  );
};

export default React.memo(NetworkMenuLink);
