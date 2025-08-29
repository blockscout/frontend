import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import * as cookies from 'lib/cookies';

export function account(req: NextRequest) {
  const isAccountSupported = process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED === 'true';
  const hasRecaptchaKey = Boolean(process.env.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY);
  const isEnabled = isAccountSupported && hasRecaptchaKey;

  if (!isEnabled) {
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
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}
