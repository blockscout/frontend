// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem, NavGroupItem, NavItemInternal } from './types';

import config from 'src/config';

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export function hasActiveItem(items: Array<NavItem> | Array<Array<NavItem>>): boolean {
  return items.flat().some((item) => isInternalItem(item) && item.isActive);
}

export function checkRouteHighlight(item: NavItem | Array<NavItem> | Array<Array<NavItem>>): boolean {
  if (Array.isArray(item)) {
    return item.some((subItem) => checkRouteHighlight(subItem));
  }
  return isInternalItem(item) && (config.shell.navigation.highlightedRoutes.includes(item.nextRoute.pathname));
}
