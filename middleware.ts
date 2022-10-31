import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import appConfig from 'configs/app/config';
import { NAMES } from 'lib/cookies';
import getCspPolicy from 'lib/csp/getCspPolicy';
import link from 'lib/link/link';

const cspPolicy = getCspPolicy();

export function middleware(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');

  if (!isPageRequest) {
    return;
  }

  // we don't have any info from router here, so just do straight forward sub-string search (sorry)
  const isAccountRoute = req.nextUrl.pathname.includes('/account/');
  const isProfileRoute = req.nextUrl.pathname.includes('/auth/profile');
  const apiToken = req.cookies.get(NAMES.API_TOKEN);

  if ((isAccountRoute || isProfileRoute) && !apiToken && appConfig.isAccountSupported) {
    const authUrl = link('auth');
    return NextResponse.redirect(authUrl);
  }

  const res = NextResponse.next();
  res.headers.append('Content-Security-Policy-Report-Only', cspPolicy);
  return res;
}

/**
 * Configure which routes should pass through the Middleware.
 * Exclude all `_next` urls.
 */
export const config = {
  matcher: [ '/', '/:notunderscore((?!_next).+)' ],
};
