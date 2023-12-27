import React from 'react';

import type { NavItem, NavGroupItem } from 'types/client/navigation-items';

import IconSvg from 'ui/shared/IconSvg';

const NavLinkIcon = ({ item }: { item: NavItem | NavGroupItem}) => {
  if ('icon' in item && item.icon) {
    return <IconSvg name={ item.icon } boxSize="30px" flexShrink={ 0 }/>;
  }
  if ('iconComponent' in item && item.iconComponent) {
    const IconComponent = item.iconComponent;
    return <IconComponent size={ 30 }/>;
  }

  return null;
};

export default NavLinkIcon;
