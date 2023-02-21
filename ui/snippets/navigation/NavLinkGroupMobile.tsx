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

import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = NavGroupItem & {
  isCollapsed?: boolean;
  onClick: () => void;
}

const NavLinkGroup = ({ text, icon, isActive, onClick }: Props) => {
  const styleProps = useNavLinkStyleProps({ isActive });

  return (
    <Box as="li" listStyleType="none" w="100%" onClick={ onClick }>
      <Box
        { ...styleProps.itemProps }
        w="100%"
        px={ 3 }
        aria-label={ `${ text } link group` }
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center" pr={ 1 }>
          <HStack spacing={ 3 } overflow="hidden">
            <Icon as={ icon } boxSize="30px"/>
            <Text
              { ...styleProps.textProps }
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
