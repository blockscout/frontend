import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { NavItem, NavGroupItem } from 'types/client/navigation-items';

const NavLinkIcon = ({ item }: { item: NavItem | NavGroupItem}) => {
  if ('icon' in item) {
    return <Icon as={ item.icon } boxSize="30px"/>;
  }
  if ('iconComponent' in item && item.iconComponent) {
    const IconComponent = item.iconComponent;
    return <IconComponent size={ 30 }/>;
  }

  return null;
};

export default NavLinkIcon;
