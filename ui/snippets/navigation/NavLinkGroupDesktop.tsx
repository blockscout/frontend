import {
  Text,
  HStack,
  Box,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation-items';

import IconSvg from 'ui/shared/IconSvg';

import NavLink from './NavLink';
import NavLinkIcon from './NavLinkIcon';
import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
}

const NavLinkGroupDesktop = ({ item, isCollapsed }: Props) => {
  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: item.isActive });

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Popover
        trigger="hover"
        placement="right-start"
        isLazy
      >
        <PopoverTrigger>
          <Link
            { ...styleProps.itemProps }
            w={{ lg: isExpanded ? '180px' : '60px', xl: isCollapsed ? '60px' : '180px' }}
            pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
            pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
            aria-label={ `${ item.text } link group` }
            position="relative"
          >
            <HStack spacing={ 3 } overflow="hidden">
              <NavLinkIcon item={ item }/>
              <Text
                { ...styleProps.textProps }
              >
                { item.text }
              </Text>
              <IconSvg
                name="arrows/east-mini"
                position="absolute"
                right="7px"
                transform="rotate(180deg)"
                boxSize={ 6 }
                opacity={{ lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' }}
                transitionProperty="opacity"
                transitionDuration="normal"
                transitionTimingFunction="ease"
              />
            </HStack>
          </Link>
        </PopoverTrigger>
        <PopoverContent width="252px" top={{ lg: isExpanded ? '-16px' : 0, xl: isCollapsed ? 0 : '-16px' }}>
          <PopoverBody p={ 4 }>
            <Text variant="secondary" fontSize="sm" mb={ 2 } display={{ lg: isExpanded ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}>
              { item.text }
            </Text>
            <VStack spacing={ 1 } alignItems="start">
              { item.subItems.map((subItem, index) => Array.isArray(subItem) ? (
                <Box
                  key={ index }
                  w="100%"
                  as="ul"
                  _notLast={{
                    mb: 2,
                    pb: 2,
                    borderBottomWidth: '1px',
                    borderColor: 'divider',
                  }}
                >
                  { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false }/>) }
                </Box>
              ) :
                <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false }/>,
              ) }
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default NavLinkGroupDesktop;
