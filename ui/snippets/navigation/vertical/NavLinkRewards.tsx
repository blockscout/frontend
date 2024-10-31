import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { NavItem } from 'types/client/navigation';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';

import NavLinkBase from './NavLinkBase';

type Props = {
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavLinkRewards = ({ isCollapsed, onClick }: Props) => {
  const router = useRouter();
  const { openLoginModal, dailyRewardQuery, apiToken, isInitialized } = useRewardsContext();

  const pathname = '/account/rewards';
  const nextRoute = { pathname } as Route;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isInitialized && !apiToken) {
      e.preventDefault();
      openLoginModal();
    }
    onClick?.();
  }, [ onClick, isInitialized, apiToken, openLoginModal ]);

  if (!config.features.rewards.isEnabled) {
    return null;
  }

  return (
    <NavLinkBase
      item={{
        text: 'Merits',
        icon: dailyRewardQuery.data?.available ? 'merits_with_dot' : 'merits',
        nextRoute: nextRoute,
        isActive: router.pathname === pathname,
      } as NavItem}
      onClick={ handleClick }
      isCollapsed={ isCollapsed }
      isDisabled={ !isInitialized }
    />
  );
};

export default React.memo(NavLinkRewards);
