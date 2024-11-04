import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';

import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import * as mixpanel from 'lib/mixpanel';

const PROTECTED_ROUTES: Array<Route['pathname']> = [
  '/account/api-key',
  '/account/custom-abi',
  '/account/tag-address',
  '/account/verified-addresses',
  '/account/watchlist',
  '/auth/profile',
];

export default function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return React.useCallback(async() => {
    cookies.remove(cookies.NAMES.API_TOKEN);

    queryClient.resetQueries({
      queryKey: getResourceKey('user_info'),
      exact: true,
    });
    queryClient.resetQueries({
      queryKey: getResourceKey('custom_abi'),
      exact: true,
    });

    mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_ACCESS, { Action: 'Logged out' }, { send_immediately: true });

    if (
      PROTECTED_ROUTES.includes(router.pathname) ||
        (router.pathname === '/txs' && router.query.tab === 'watchlist')
    ) {
      router.push({ pathname: '/' }, undefined, { shallow: true });
    }
  }, [ queryClient, router ]);
}
