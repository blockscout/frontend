import {
  Text,
  HStack,
  Flex,
  Box,
} from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation-items';

import IconSvg from 'ui/shared/IconSvg';

import NavLinkIcon from './NavLinkIcon';
import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = {
  item: NavGroupItem;
  onClick: () => void;
  isExpanded?: boolean;
}

const NavLinkGroup = ({ item, onClick, isExpanded }: Props) => {
  const styleProps = useNavLinkStyleProps({ isActive: item.isActive, isExpanded });

  return (
    <Box as="li" listStyleType="none" w="100%" onClick={ onClick }>
      <Box
        { ...styleProps.itemProps }
        w="100%"
        px={ 3 }
        aria-label={ `${ item.text } link group` }
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center" pr={ 1 }>
          <HStack spacing={ 3 } overflow="hidden">
            <NavLinkIcon item={ item }/>
            <Text
              { ...styleProps.textProps }
            >
              { item.text }
            </Text>
          </HStack>
          <IconSvg name="arrows/east-mini" transform="rotate(180deg)" boxSize={ 6 }/>
        </Flex>
      </Box>
    </Box>
  );
};

export default NavLinkGroup;
