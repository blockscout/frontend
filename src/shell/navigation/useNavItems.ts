// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NavItem, NavGroupItem } from './types';

import { useRouter } from 'src/shared/router/useRouter';

import { getAccountNavItems } from './nav-items/account';
import { getMainNavItems } from './nav-items/main';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;
  const tab = router.query.tab;

  return React.useMemo(() => ({
    mainNavItems: getMainNavItems({ pathname, tab }),
    accountNavItems: getAccountNavItems(pathname),
  }), [ pathname, tab ]);
}
