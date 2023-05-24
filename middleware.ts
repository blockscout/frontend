import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { route } from 'nextjs-routes';

import appConfig from 'configs/app/config';
import { NAMES } from 'lib/cookies';
import generateCspPolicy from 'lib/csp/generateCspPolicy';

const cspPolicy = generateCspPolicy();

export function middleware(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');
  const start = Date.now();

  if (!isPageRequest) {
    return;
  }

  // we don't have any info from router here, so just do straight forward sub-string search (sorry)
  const isAccountRoute =
    req.nextUrl.pathname.includes('/account/') ||
    (req.nextUrl.pathname === '/txs' && req.nextUrl.searchParams.get('tab') === 'watchlist');
  const isProfileRoute = req.nextUrl.pathname.includes('/auth/profile');
  const apiToken = req.cookies.get(NAMES.API_TOKEN);

  if ((isAccountRoute || isProfileRoute) && !apiToken && appConfig.isAccountSupported) {
    const authUrl = appConfig.authUrl + route({ pathname: '/auth/auth0', query: { path: req.nextUrl.pathname } });
    return NextResponse.redirect(authUrl);
  }

  const end = Date.now();
  const res = NextResponse.next();
  res.headers.append('Content-Security-Policy', cspPolicy);
  res.headers.append('Server-Timing', `middleware;dur=${ end - start }`);
  // eslint-disable-next-line no-restricted-properties
  res.headers.append('Docker-ID', process.env.HOSTNAME || '');

  return res;
}

/**
 * Configure which routes should pass through the Middleware.
 */
export const config = {
  matcher: [ '/', '/:notunderscore((?!_next).+)' ],
  // matcher: [
  //   '/((?!.*\\.|api\\/|node-api\\/).*)', // exclude all static + api + node-api routes
  // ],
};
