import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { NAMES } from 'lib/cookies';
import getCspPolicy from 'lib/csp/getCspPolicy';
import { link } from 'lib/link/link';
import findNetwork from 'lib/networks/findNetwork';

const cspPolicy = getCspPolicy();

export function middleware(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');

  if (!isPageRequest) {
    return;
  }

  const [ , networkType, networkSubtype ] = req.nextUrl.pathname.split('/');
  const networkParams = {
    network_type: networkType,
    network_sub_type: networkSubtype,
  };
  const selectedNetwork = findNetwork(networkParams);

  if (!selectedNetwork) {
    return;
  }

  // we don't have any info from router here, so just do straight forward sub-string search (sorry)
  const isAccountRoute = req.nextUrl.pathname.includes('/account/');
  const apiToken = req.cookies.get(NAMES.API_TOKEN);

  if (isAccountRoute && !apiToken) {
    const authUrl = link('auth', networkParams);
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
