import { HStack, PopoverBody, PopoverContent, PopoverTrigger, chakra, StackDivider } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import useColors from '../useColors';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';
interface Props {
  item: NavGroupItem;
}

const NavLinkGroup = ({ item }: Props) => {
  const colors = useColors();
  const bgColor = item.isActive ? colors.bg.active : colors.bg.default;
  const color = item.isActive ? colors.text.active : colors.text.default;

  const isHighlighted = checkRouteHighlight(item.subItems);
  const hasGroups = item.subItems.some((subItem) => Array.isArray(subItem));

  return (
    <Popover
      trigger="hover"
      placement="bottom"
      isLazy
      gutter={ 8 }
    >
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <chakra.li
              listStyleType="none"
              display="flex"
              alignItems="center"
              px={ 2 }
              py={ 1.5 }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 500 }
              cursor="pointer"
              color={ isOpen ? colors.text.hover : color }
              _hover={{ color: colors.text.hover }}
              bgColor={ bgColor }
              borderRadius="base"
              { ...getDefaultTransitionProps() }
            >
              { item.text }
              { isHighlighted && <LightningLabel iconColor={ bgColor } position={{ lg: 'static' }} ml={{ lg: '2px' }}/> }
              <IconSvg name="arrows/east-mini" boxSize={ 5 } transform="rotate(-90deg)" ml={ 1 }/>
            </chakra.li>
          </PopoverTrigger>
          <PopoverContent w="fit-content">
            <PopoverBody p={ 4 }>
              { hasGroups ? (
                <HStack divider={ <StackDivider borderColor="divider"/> } alignItems="flex-start">
                  { item.subItems.map((subItem, index) => {
                    if (!Array.isArray(subItem)) {
                      return <NavLink key={ subItem.text } item={ subItem }/>;
                    }

                    return (
                      <chakra.ul key={ index } display="flex" flexDir="column" rowGap={ 1 }>
                        { subItem.map((navItem) => <NavLink key={ navItem.text } item={ navItem }/>) }
                      </chakra.ul>
                    );
                  }) }
                </HStack>
              ) : (
                <chakra.ul display="flex" flexDir="column" rowGap={ 1 }>
                  { item.subItems.map((subItem) => {
                    if (Array.isArray(subItem)) {
                      return null;
                    }
                    return <NavLink key={ subItem.text } item={ subItem }/>;
                  }) }
                </chakra.ul>
              ) }
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(NavLinkGroup);
