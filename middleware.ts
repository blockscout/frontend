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

  if (appConfig.basePath) {
    const [ firstPart, secondPart ] = req.nextUrl.pathname.split(appConfig.basePath);
    if (firstPart && !secondPart) {
      // for urls like /foo/bar we redirect to /base/path/foo/bar
      const newPath = appConfig.basePath + firstPart;
      if (newPath !== req.nextUrl.pathname) {
        const url = new URL(req.nextUrl.origin + newPath).toString();
        return NextResponse.redirect(url);
      }
    } else if (!firstPart && secondPart) {
      // for urls like /base/path/foo/bar we do rewrite to /foo/bar
      const url = new URL(req.nextUrl.origin + secondPart).toString();
      return NextResponse.rewrite(url);
    } else {
      // for urls like /base/path we do rewrite to root
      const url = new URL(req.nextUrl.origin).toString();
      return NextResponse.rewrite(url);
    }
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
