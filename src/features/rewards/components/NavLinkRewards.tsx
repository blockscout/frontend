// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { useCallback } from 'react';

import NavLink from 'src/shell/navigation/vertical/NavLink';

import { useRewardsContext } from 'src/features/rewards/context';

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';
import { useRouter } from 'src/shared/router/useRouter';

type Props = {
  isCollapsed?: boolean;
  onClick?: () => void;
};

const NavLinkRewards = ({ isCollapsed, onClick }: Props) => {
  const router = useRouter();
  const { openLoginModal, dailyRewardQuery, isAuth, isInitialized } = useRewardsContext();

  const pathname = '/account/merits';
  const nextRoute = { pathname } as Route;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isInitialized && !isAuth) {
      e.preventDefault();
      openLoginModal();
    }
    onClick?.();
  }, [ onClick, isInitialized, isAuth, openLoginModal ]);

  if (!config.features.rewards.isEnabled) {
    return null;
  }

  return (
    <NavLink
      item={{
        text: 'Merits',
        icon: dailyRewardQuery.data?.available ? 'navigation/merits_with_dot' : 'navigation/merits',
        nextRoute: nextRoute,
        isActive: router.pathname === pathname,
      }}
      onClick={ handleClick }
      isCollapsed={ isCollapsed }
      isDisabled={ !isInitialized }
    />
  );
};

export default React.memo(NavLinkRewards);
