import React from 'react';

import type { NavItem } from 'types/client/navigation';

import NavLinkBase from './NavLinkBase';

type Props = {
  item: NavItem;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavLink = ({ item, isCollapsed, onClick }: Props) => (
  <NavLinkBase
    item={ item }
    onClick={ onClick }
    isCollapsed={ isCollapsed }
  />
);

export default React.memo(NavLink);
