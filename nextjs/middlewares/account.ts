import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { DAY } from 'lib/consts';
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
      const authUrl = feature.authUrl + route({ pathname: '/auth/auth0', query: { path: req.nextUrl.pathname } });
      return NextResponse.redirect(authUrl);
    }
  }

  // if user hasn't confirmed email yet
  if (req.cookies.get(cookies.NAMES.INVALID_SESSION)) {
    // if user has both cookies, make redirect to logout
    if (apiTokenCookie) {
      // yes, we could have checked that the current URL is not the logout URL, but we hadn't
      // logout URL is always external URL in auth0.com sub-domain
      // at least we hope so

      const res = NextResponse.redirect(feature.logoutUrl);
      res.cookies.delete(cookies.NAMES.CONFIRM_EMAIL_PAGE_VIEWED); // reset cookie to show email verification page again

      return res;
    }

    // if user hasn't seen email verification page, make redirect to it
    if (!req.cookies.get(cookies.NAMES.CONFIRM_EMAIL_PAGE_VIEWED)) {
      if (!req.nextUrl.pathname.includes('/auth/unverified-email')) {
        const url = config.app.baseUrl + route({ pathname: '/auth/unverified-email' });
        const res = NextResponse.redirect(url);
        res.cookies.set({
          name: cookies.NAMES.CONFIRM_EMAIL_PAGE_VIEWED,
          value: 'true',
          expires: Date.now() + 7 * DAY,
        });
        return res;
      }
    }
  }
}
