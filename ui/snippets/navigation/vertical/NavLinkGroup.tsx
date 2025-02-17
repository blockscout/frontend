import {
  Text,
  HStack,
  Box,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import Popover from 'ui/shared/chakra/Popover';

import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
  onMouseOver?: () => void
  hideSublinks?: boolean
};

const NavLinkGroup = ({ item, isCollapsed, onMouseOver, hideSublinks }: Props) => {
  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: item.isActive });

  const isHighlighted = checkRouteHighlight(item.subItems);

  return (
    <Box as="li" listStyleType="none" w="100%" onMouseOver={onMouseOver}>
      <Popover
        trigger="hover"
        placement="bottom"
        isLazy={ false }
        gutter={ 8 }
      >
        <PopoverTrigger>
          <Box
            { ...styleProps.itemProps }
            mr={ 3 }
            aria-label={ `${ item.text } link group` }
            position="relative"
          >
            <HStack spacing={ 0 }>
              <Button
                size="sm"
                fontWeight="400"
                fontSize="14px"
                bg={ isHighlighted ? styleProps.itemProps.bgColor : "transparent"}
              >
                { item.text }
              </Button>
            </HStack>
          </Box>
        </PopoverTrigger>

        {!hideSublinks && <PopoverContent width="252px" top={{ lg: isExpanded ? '-16px' : 0, xl: isCollapsed ? 0 : '-16px' }}>
          <PopoverBody p={ 4 }>
            <Text variant="secondary" fontSize="sm" mb={ 1 } display={{ lg: isExpanded ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}>
              { item.text }
            </Text>
            <VStack spacing={ 1 } alignItems="start" as="ul">
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
        </PopoverContent>}
      </Popover>
    </Box>
  );
};

export default NavLinkGroup;
