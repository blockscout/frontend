import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { NetworkLink } from './types';

import checkIcon from 'icons/check.svg';

import useColors from '../useColors';

type Props = NetworkLink;

const NetworkMenuLink = ({ name, url, icon, iconColor }: Props) => {
  const isActive = name === 'Gnosis Chain';
  const colors = useColors();

  return (
    <Box as="li" listStyleType="none">
      <NextLink href={ url } passHref>
        <Flex
          as="a"
          px={ 4 }
          py={ 2 }
          alignItems="center"
          cursor="pointer"
          borderWidth="1px"
          borderColor={ isActive ? colors.border.active : colors.border.default }
          borderRadius="base"
          color={ isActive ? colors.text.active : colors.text.default }
          bgColor={ isActive ? colors.bg.active : colors.bg.default }
          _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        >
          <Icon
            as={ icon }
            boxSize="40px"
            color={ iconColor || 'inherit' }
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
