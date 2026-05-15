// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { CSP_NONCE_HEADER } from 'nextjs/constants';
import * as csp from 'nextjs/csp/index';
import * as middlewares from 'nextjs/middlewares/index';

export async function proxy(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');
  const start = Date.now();

  if (!isPageRequest) {
    return;
  }

  const accountResponse = middlewares.account(req);
  if (accountResponse) {
    return accountResponse;
  }

  const nonce = crypto.randomUUID().replaceAll('-', '');
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  middlewares.appProfile(req, res);
  middlewares.colorTheme(req, res);
  middlewares.addressFormat(req, res);
  middlewares.scamTokens(req, res);
  middlewares.poorReputationTokens(req, res);

  const end = Date.now();

  const cspHeader = await csp.get(req, nonce);

  res.headers.append('Content-Security-Policy', cspHeader);
  res.headers.append('Server-Timing', `middleware;dur=${ end - start }`);
  res.headers.append('Docker-ID', process.env.HOSTNAME || '');

  return res;
}

/**
 * Configure which routes should pass through the proxy.
 */
export const config = {
  matcher: [ '/', '/:notunderscore((?!_next).+)' ],
  // matcher: [
  //   '/((?!.*\\.|api\\/|node-api\\/).*)', // exclude all static + api + node-api routes
  // ],
};
