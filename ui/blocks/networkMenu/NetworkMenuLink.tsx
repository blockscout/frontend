import { Box, Flex, Icon, Text, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Network } from 'types/networks';

import checkIcon from 'icons/check.svg';
import placeholderIcon from 'icons/networks/icons/placeholder.svg';
import isAccountRoute from 'lib/networks/isAccountRoute';

import useColors from './useColors';

interface Props extends Network {
  isActive: boolean;
  isMobile?: boolean;
  routeName: string;
}

const NetworkMenuLink = ({ name, type, subType, icon, isActive, isMobile, routeName, isAccountSupported }: Props) => {
  const isAccount = isAccountRoute(routeName);
  const localPath = (() => {
    if (isAccount && isAccountSupported) {
      return routeName;
    }

    if (isAccount && !isAccountSupported) {
      return '';
    }

    // will change when blocks&transaction is implemented
    return routeName;
  })();
  const pathName = `/${ type }${ subType ? '/' + subType : '' }${ localPath }`;

  // will fix later after we agree on CI/CD workflow
  const href = type === 'xdai' && subType === 'testnet' ? pathName : 'https://blockscout.com' + pathName;
  const hasIcon = Boolean(icon);
  const colors = useColors({ hasIcon });

  const iconEl = typeof icon === 'string' ? (
    <Image w="30px" h="30px" src={ icon } alt={ `${ type } ${ subType ? subType : '' } network icon` }/>
  ) : (
    <Icon
      as={ hasIcon ? icon : placeholderIcon }
      boxSize="30px"
      color={ isActive ? colors.icon.active : colors.icon.default }
    />
  );

  return (
    <Box as="li" listStyleType="none">
      <NextLink href={ href } passHref>
        <Flex
          as="a"
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
            { name }
          </Text>
          { isActive && (
            <Icon
              as={ checkIcon }
              boxSize="24px"
              marginLeft="auto"
            />
          ) }
        </Flex>
      </NextLink>
    </Box>
  );
};

export default React.memo(NetworkMenuLink);
