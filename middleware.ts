import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import generateCspPolicy from 'nextjs/csp/generateCspPolicy';
import * as middlewares from 'nextjs/middlewares/index';

const cspPolicy = generateCspPolicy();

export function middleware(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');
  const start = Date.now();

  if (!isPageRequest) {
    return;
  }

  const accountResponse = middlewares.account(req);
  if (accountResponse) {
    return accountResponse;
  }

  const res = NextResponse.next();

  middlewares.colorTheme(req, res);
  middlewares.addressFormat(req, res);
  middlewares.scamTokens(req, res);

  const end = Date.now();

  res.headers.append('Content-Security-Policy', cspPolicy);
  res.headers.append('Server-Timing', `middleware;dur=${ end - start }`);
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
