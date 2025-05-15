import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import * as mixpanel from 'lib/mixpanel';
import { toaster } from 'toolkit/chakra/toaster';

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

  return React.useCallback(async() => {
    try {
      await apiFetch('general:auth_logout');
      cookies.remove(cookies.NAMES.API_TOKEN);

      if (config.features.rewards.isEnabled) {
        const rewardsToken = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
        if (rewardsToken) {
          await apiFetch('rewards:logout', { fetchParams: {
            method: 'POST',
            headers: { Authorization: `Bearer ${ rewardsToken }` },
          } });
          cookies.remove(cookies.NAMES.REWARDS_API_TOKEN);
        }
      }

      queryClient.resetQueries({
        queryKey: getResourceKey('general:user_info'),
        exact: true,
      });
      queryClient.resetQueries({
        queryKey: getResourceKey('general:custom_abi'),
        exact: true,
      });

      mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_ACCESS, { Action: 'Logged out' }, { send_immediately: true });
      mixpanel.reset();

      if (
        PROTECTED_ROUTES.includes(router.pathname) ||
          (router.pathname === '/txs' && router.query.tab === 'watchlist')
      ) {
        router.push({ pathname: '/' }, undefined, { shallow: true });
      }
    } catch (error) {
      toaster.error({
        title: 'Logout failed',
        description: 'Please try again later',
      });
    }
  }, [ apiFetch, queryClient, router ]);
}
