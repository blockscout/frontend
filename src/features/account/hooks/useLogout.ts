// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import React from 'react';

import useApiFetch from 'src/api/hooks/useApiFetch';
import { getResourceKey } from 'src/api/hooks/useApiQuery';

import useWalletReown from 'src/features/connect-wallet/hooks/wallet/useWalletReown';
import { useRewardsContext } from 'src/features/rewards/context';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import * as cookies from 'src/shared/storage/cookies';

import { toaster } from 'src/toolkit/chakra/toaster';

const PROTECTED_ROUTES: Array<Route['pathname']> = [
  '/account/api-key',
  '/account/custom-abi',
  '/account/merits',
  '/account/tag-address',
  '/account/verified-addresses',
  '/account/watchlist',
  '/auth/profile',
];

export default function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();
  const { logout: rewardsLogout } = useRewardsContext();
  const { disconnect } = useWalletReown({ source: 'Profile dropdown' });

  return React.useCallback(async() => {
    try {
      await apiFetch('core:auth_logout');
      disconnect();
      cookies.remove(cookies.NAMES.API_TOKEN);

      if (config.features.rewards.isEnabled) {
        rewardsLogout();
      }

      mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_ACCESS, { Action: 'Logged out' }, { send_immediately: true });
      mixpanel.reset();

      if (
        PROTECTED_ROUTES.includes(router.pathname) ||
          (router.pathname === '/txs' && router.query.tab === 'watchlist')
      ) {
        await router.push({ pathname: '/' }, undefined, { shallow: true });
      }

      queryClient.resetQueries({
        queryKey: getResourceKey('core:user_info'),
        exact: true,
      });
      queryClient.resetQueries({
        queryKey: getResourceKey('core:custom_abi'),
        exact: true,
      });
    } catch (error) {
      toaster.error({
        title: 'Logout failed',
        description: 'Please try again later',
      });
    }
  }, [ apiFetch, rewardsLogout, queryClient, router, disconnect ]);
}
