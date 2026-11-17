// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavGroupItem, NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';

import { hasActiveItem } from '../utils';

type StatsNavGroupItem = NavGroupItem & { nextRoute: Route };

function getStatsSubItems(pathname: NavLocation['pathname']): Array<NavItem> {
  const megaEthFeature = config.features.megaEth;

  return [
    config.features.stats.isEnabled && {
      text: 'Chain stats',
      nextRoute: { pathname: '/stats' as const },
      icon: 'navigation/chain_stats',
      isActive: pathname.startsWith('/stats'),
    },
    config.features.multichain.isEnabled && {
      text: 'Ecosystems',
      nextRoute: { pathname: '/ecosystems' as const },
      icon: 'navigation/ecosystems',
      isActive: pathname.startsWith('/ecosystems'),
    },
    megaEthFeature.isEnabled && megaEthFeature.socketUrl.metrics && {
      text: 'Uptime',
      nextRoute: { pathname: '/uptime' as const },
      icon: 'navigation/uptime',
      isActive: pathname.startsWith('/uptime'),
    },
    config.features.hotContracts.isEnabled && {
      text: 'Hot contracts',
      nextRoute: { pathname: '/hot-contracts' as const },
      icon: 'navigation/hot_contracts',
      isActive: pathname.startsWith('/hot-contracts'),
    },
    config.features.gasTracker.isEnabled && {
      text: 'Gas tracker',
      nextRoute: { pathname: '/gas-tracker' as const },
      icon: 'navigation/gas_tracker',
      isActive: pathname.startsWith('/gas-tracker'),
    },
    config.features.crossChainTxs.isEnabled && !config.features.multichain.isEnabled && {
      text: 'ICTT users',
      nextRoute: { pathname: '/ictt-users' as const },
      icon: 'navigation/ictt_users',
      isActive: pathname.startsWith('/ictt-users'),
    },
  ].filter(Boolean);
}

export function getStatsNavItem(pathname: NavLocation['pathname']): StatsNavGroupItem | null {
  const subItems = getStatsSubItems(pathname);

  if (subItems.length === 0) {
    return null;
  }

  return {
    text: 'Charts & stats',
    nextRoute: { pathname: '/stats' as const },
    icon: 'navigation/stats',
    isActive: hasActiveItem(subItems),
    subItems,
  };
}
