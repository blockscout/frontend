import {
  Icon,
  Text,
  HStack,
  Flex,
  Box,
} from '@chakra-ui/react';
import React from 'react';

import chevronIcon from 'icons/arrows/east-mini.svg';
import type { NavGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

type Props = NavGroupItem & {
  isCollapsed?: boolean;
  onClick: () => void;
}

const NavLinkGroup = ({ text, icon, isActive, onClick }: Props) => {
  const colors = useColors();

  return (
    <Box as="li" listStyleType="none" w="100%" onClick={ onClick }>
      <Box
        w="100%"
        px={ 3 }
        py={ 2.5 }
        display="flex"
        color={ isActive ? colors.text.active : colors.text.default }
        bgColor={ isActive ? colors.bg.active : colors.bg.default }
        _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        borderRadius="base"
        whiteSpace="nowrap"
        aria-label={ `${ text } link group` }
        { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center" pr={ 1 }>
          <HStack spacing={ 3 } overflow="hidden">
            <Icon as={ icon } boxSize="30px"/>
            <Text
              variant="inherit"
              fontSize="sm"
              lineHeight="20px"
              transitionProperty="opacity"
              transitionDuration="normal"
              transitionTimingFunction="ease"
            >
              { text }
            </Text>
          </HStack>
          <Icon as={ chevronIcon } transform="rotate(180deg)" boxSize={ 6 }/>
        </Flex>
      </Box>
    </Box>
  );
};

export default NavLinkGroup;
