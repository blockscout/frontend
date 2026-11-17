// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

export function getAccountNavItems(pathname: NavLocation['pathname']): Array<NavItem> {
  return [
    {
      text: 'Watch list',
      nextRoute: { pathname: '/account/watchlist' as const },
      icon: 'navigation/watchlist',
      isActive: pathname === '/account/watchlist',
    },
    {
      text: 'Private tags',
      nextRoute: { pathname: '/account/tag-address' as const },
      icon: 'navigation/private_tags',
      isActive: pathname === '/account/tag-address',
    },
    {
      text: 'API keys',
      nextRoute: { pathname: '/account/api-key' as const },
      icon: 'navigation/api_keys',
      isActive: pathname === '/account/api-key',
    },
    {
      text: 'Custom ABI',
      nextRoute: { pathname: '/account/custom-abi' as const },
      icon: 'navigation/custom_abi',
      isActive: pathname === '/account/custom-abi',
    },
    getFeaturePayload(config.features.account)?.verifiedAddresses?.isEnabled && {
      text: 'Verified addrs',
      nextRoute: { pathname: '/account/verified-addresses' as const },
      icon: 'navigation/verified_contracts',
      isActive: pathname === '/account/verified-addresses',
    },
  ].filter(Boolean);
}
