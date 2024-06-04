import { Popover, PopoverBody, PopoverContent, PopoverTrigger, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
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

  return (
    <Popover
      trigger="hover"
      placement="bottom-start"
      isLazy
    >
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <chakra.li
              listStyleType="none"
              display="flex"
              alignItems="center"
              columnGap={ 1 }
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
              { isHighlighted && <LightningLabel bgColor={ bgColor } position={{ lg: 'static' }}/> }
              <IconSvg name="arrows/east-mini" boxSize={ 5 } transform="rotate(-90deg)"/>
            </chakra.li>
          </PopoverTrigger>
          <PopoverContent w="fit-content">
            <PopoverBody p={ 4 } w="252px">
              <chakra.ul display="flex" flexDir="column" rowGap={ 1 }>
                { item.subItems.map((subItem) => {
                  if (Array.isArray(subItem)) {
                    return null;
                  }
                  return <NavLink key={ subItem.text } item={ subItem }/>;
                }) }
              </chakra.ul>
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(NavLinkGroup);
