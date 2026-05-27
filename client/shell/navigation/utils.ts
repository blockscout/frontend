// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { NavItem } from './types';

import { isInternalItem } from './useNavItems';

export function checkRouteHighlight(item: NavItem | Array<NavItem> | Array<Array<NavItem>>): boolean {
  if (Array.isArray(item)) {
    return item.some((subItem) => checkRouteHighlight(subItem));
  }
  return isInternalItem(item) && (config.shell.navigation.highlightedRoutes.includes(item.nextRoute.pathname));
}
