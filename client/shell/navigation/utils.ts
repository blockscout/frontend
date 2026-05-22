// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from './types';

import config from 'configs/app';

import { isInternalItem } from './useNavItems';

export function checkRouteHighlight(item: NavItem | Array<NavItem> | Array<Array<NavItem>>): boolean {
  if (Array.isArray(item)) {
    return item.some((subItem) => checkRouteHighlight(subItem));
  }
  return isInternalItem(item) && (config.UI.navigation.highlightedRoutes.includes(item.nextRoute.pathname));
}
