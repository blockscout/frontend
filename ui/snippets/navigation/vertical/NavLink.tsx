import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';

import NavLinkBase from './NavLinkBase';

type Props = {
  item: NavItem;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavLink = ({ item, isCollapsed, onClick }: Props) => {
  const isInternalLink = isInternalItem(item);
  return (
    <NavLinkBase
      item={ item }
      nextRoute={ 'nextRoute' in item ? item.nextRoute : undefined }
      onClick={ onClick }
      href={ isInternalLink ? route(item.nextRoute) : item.url }
      isActive={ isInternalLink && item.isActive }
      isExternal={ !isInternalLink }
      isCollapsed={ isCollapsed }
    />
  );
};

export default React.memo(NavLink);
