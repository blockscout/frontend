import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Network } from 'types/networks';

import checkIcon from 'icons/check.svg';
import placeholderIcon from 'icons/networks/placeholder.svg';

import useColors from './useColors';

interface Props extends Network {
  isActive: boolean;
  routeName: string;
}

const NetworkMenuLink = ({ name, type, subType, icon, isActive, routeName }: Props) => {
  const pathName = `/${ type }/${ subType }` + (routeName || '');

  // will fix later after we agree on CI/CD workflow
  // const href = isNewUi ? pathname : 'https://blockscout.com' + pathname;
  const href = pathName;
  const hasIcon = Boolean(icon);
  const colors = useColors({ hasIcon });

  return (
    <Box as="li" listStyleType="none">
      <NextLink href={ href } passHref>
        <Flex
          as="a"
          px={ 4 }
          py={ 3 }
          alignItems="center"
          cursor="pointer"
          pointerEvents={ isActive ? 'none' : 'initial' }
          borderWidth="1px"
          borderColor={ isActive ? colors.border.active : colors.border.default }
          borderRadius="base"
          color={ isActive ? colors.text.active : colors.text.default }
          bgColor={ isActive ? colors.bg.active : colors.bg.default }
          _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        >
          <Icon
            as={ hasIcon ? icon : placeholderIcon }
            boxSize="30px"
            color={ isActive ? colors.icon.active : colors.icon.default }
          />
          <Text
            marginLeft={ 3 }
            fontWeight="500"
            color="inherit"
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
