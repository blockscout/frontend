// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavGroupItem, NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';

import { hasActiveItem } from '../utils';
import { getApiNavItem } from './api';
import { getBlockchainNavItems } from './blockchain';
import { getOtherNavItems } from './other';
import { getStatsNavItem } from './stats';
import { getTokensNavItems } from './tokens';

const marketplaceFeature = config.features.marketplace;

function getMarketplaceNavItem(pathname: NavLocation['pathname']): NavItem | null {
  if (!marketplaceFeature.isEnabled) {
    return null;
  }

  return {
    text: marketplaceFeature.titles.menu_item,
    nextRoute: { pathname: '/apps' as const },
    icon: 'navigation/apps',
    isActive: pathname.startsWith('/app') || pathname.startsWith('/essential-dapps'),
  };
}

export function getMainNavItems(location: NavLocation): Array<NavItem | NavGroupItem> {
  const { pathname } = location;
  const blockchainNavItems = getBlockchainNavItems(location);
  const tokensNavItems = getTokensNavItems(pathname);
  const otherNavItems = getOtherNavItems(pathname);

  return [
    {
      text: 'Blockchain',
      icon: 'navigation/blockchain',
      isActive: hasActiveItem(blockchainNavItems),
      subItems: blockchainNavItems,
    },
    {
      text: 'Tokens',
      icon: 'navigation/tokens',
      isActive: hasActiveItem(tokensNavItems),
      subItems: tokensNavItems,
    },
    getMarketplaceNavItem(pathname),
    getStatsNavItem(pathname),
    getApiNavItem(pathname),
    {
      text: 'Other',
      icon: 'navigation/other',
      isActive: hasActiveItem(otherNavItems),
      subItems: otherNavItems,
    },
  ].filter(Boolean);
}
