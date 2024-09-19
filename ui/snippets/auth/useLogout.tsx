import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';

import * as cookies from 'lib/cookies';

const PROTECTED_ROUTES: Array<Route['pathname']> = [
  '/account/api-key',
  '/account/custom-abi',
  '/account/tag-address',
  '/account/verified-addresses',
  '/account/watchlist',
  '/auth/profile',
  '/auth/unverified-email',
];

export default function useLogout() {
  const router = useRouter();

  return React.useCallback(async() => {
    cookies.remove(cookies.NAMES.API_TOKEN);

    if (
      PROTECTED_ROUTES.includes(router.pathname) ||
        (router.pathname === '/txs' && router.query.tab === 'watchlist')
    ) {
      window.location.assign('/');
    } else {
      window.location.reload();
    }
  }, [ router ]);
}
