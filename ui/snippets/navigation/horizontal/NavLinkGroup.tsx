import { HStack, chakra, Separator, Link } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import { PopoverRoot, PopoverBody, PopoverContent, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';
interface Props {
  item: NavGroupItem;
}

const NavLinkGroup = ({ item }: Props) => {
  const [ isOpen, setIsOpen ] = React.useState(false);
  // const bgColor = item.isActive ? colors.bg.active : colors.bg.default;
  // const color = item.isActive ? colors.text.active : colors.text.default;

  const isHighlighted = checkRouteHighlight(item.subItems);
  const hasGroups = item.subItems.some((subItem) => Array.isArray(subItem));

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    setIsOpen(open);
  }, []);

  return (
    <PopoverRoot
      // TODO @tom2drum make menu open on hover
      // trigger="hover"
      onOpenChange={ handleOpenChange }
      lazyMount
      positioning={{
        placement: 'bottom',
        offset: { mainAxis: 8 },
      }}
    >
      <PopoverTrigger>
        <Link
          as="li"
          listStyleType="none"
          display="flex"
          alignItems="center"
          px={ 2 }
          py={ 1.5 }
          textStyle="sm"
          fontWeight={ 500 }
          visual="navigation"
          { ...(item.isActive ? { 'data-selected': true } : {}) }
          { ...(isOpen ? { 'data-active': true } : {}) }
          borderRadius="base"
        >
          { item.text }
          { isHighlighted && (
            <LightningLabel
              iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg' }
              position={{ lg: 'static' }}
              ml={{ lg: '2px' }}
            />
          ) }
          <IconSvg name="arrows/east-mini" boxSize={ 5 } transform="rotate(-90deg)" ml={ 1 }/>
        </Link>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          { hasGroups ? (
            <HStack separator={ <Separator/> } alignItems="flex-start">
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
    </PopoverRoot>
  );
};

export default React.memo(NavLinkGroup);
