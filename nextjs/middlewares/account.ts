import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import config from 'configs/app';
import * as cookies from 'lib/cookies';

export function account(req: NextRequest) {
  const feature = config.features.account;
  if (!feature.isEnabled) {
    return;
  }

  const apiTokenCookie = req.cookies.get(cookies.NAMES.API_TOKEN);

  // if user doesn't have api token cookie and he is trying to access account page
  // do redirect to auth page
  if (!apiTokenCookie) {
    // we don't have any info from router here, so just do straight forward sub-string search (sorry)
    const isAccountRoute =
        req.nextUrl.pathname.includes('/account/') ||
        (req.nextUrl.pathname === '/txs' && req.nextUrl.searchParams.get('tab') === 'watchlist');
    const isProfileRoute = req.nextUrl.pathname.includes('/auth/profile');

    if ((isAccountRoute || isProfileRoute)) {
      if (feature.authUrl) {
        const authUrl = new URL(feature.authUrl, req.nextUrl.origin);
        authUrl.searchParams.set('path', `${ req.nextUrl.pathname }${ req.nextUrl.search }`);

        return NextResponse.redirect(authUrl);
      }

      return NextResponse.redirect(config.app.baseUrl);
    }
  }
}
