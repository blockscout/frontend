// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';

export function getTokensNavItems(pathname: NavLocation['pathname']): Array<NavItem> {
  return [
    {
      text: 'Tokens',
      nextRoute: { pathname: '/tokens' as const },
      icon: 'navigation/tokens',
      isActive: pathname === '/tokens' || pathname.startsWith('/token/'),
    },
    {
      text: 'Token transfers',
      nextRoute: { pathname: '/token-transfers' as const },
      icon: 'navigation/token_transfers',
      isActive: pathname === '/token-transfers',
    },
    config.features.dexPools.isEnabled && {
      text: 'DEX tracker',
      nextRoute: { pathname: '/pools' as const },
      icon: 'navigation/dex_tracker',
      isActive: pathname === '/pools' || pathname.startsWith('/pool/'),
    },
  ].filter(Boolean);
}
