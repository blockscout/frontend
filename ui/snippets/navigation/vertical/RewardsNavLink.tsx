import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';
import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';

import NavLinkBase from './NavLinkBase';

type Props = {
  isCollapsed?: boolean;
  onClick?: () => void;
}

const RewardsNavLink = ({ isCollapsed, onClick }: Props) => {
  const router = useRouter();
  const { openLoginModal, dailyRewardQuery, apiToken, isInitialized } = useRewardsContext();

  const pathname = '/account/rewards';
  const nextRoute = { pathname } as Route;

  const isLogedIn = isInitialized && apiToken;

  const handleClick = useCallback(() => {
    if (isInitialized && !apiToken) {
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
      } as NavItem}
      nextRoute={ isLogedIn ? nextRoute : undefined }
      onClick={ handleClick }
      as={ isLogedIn ? 'a' : 'button' }
      target="_self"
      href={ isLogedIn ? route(nextRoute) : undefined }
      isActive={ router.pathname === pathname }
      isDisabled={ !isInitialized }
      isCollapsed={ isCollapsed }
    />
  );
};

export default React.memo(RewardsNavLink);
