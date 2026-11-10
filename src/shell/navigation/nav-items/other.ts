// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

export function getOtherNavItems(pathname: NavLocation['pathname']): Array<NavItem> {
  return [
    config.features.multichain.isEnabled ? {
      text: 'Verify contract',
      url: 'https://vera.blockscout.com',
    } : {
      text: 'Verify contract',
      nextRoute: { pathname: '/contract-verification' as const },
      isActive: pathname.startsWith('/contract-verification'),
    },
    getFeaturePayload(config.features.addressMetadata)?.isTagSubmitionEnabled && {
      text: 'Submit public tag',
      nextRoute: { pathname: '/public-tags/submit' as const },
      isActive: pathname.startsWith('/public-tags/submit'),
    },
    getFeaturePayload(config.features.rollup)?.type === 'arbitrum' && {
      text: 'Txn withdrawals',
      nextRoute: { pathname: '/txn-withdrawals' as const },
      isActive: pathname.startsWith('/txn-withdrawals'),
    },
    ...config.shell.navigation.otherLinks,
  ].filter(Boolean);
}
