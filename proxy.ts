// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { CSP_NONCE_HEADER } from 'nextjs/constants';
import * as csp from 'nextjs/csp/index';
import * as middlewares from 'nextjs/middlewares/index';

import appConfig from 'configs/app';

const adsBannerFeature = appConfig.features.adsBanner;
const adsTextFeature = appConfig.features.adsText;
const shouldUseCspNonce =
  (adsBannerFeature.isEnabled && adsBannerFeature.provider === 'sevio') ||
  (adsTextFeature.isEnabled && adsTextFeature.provider === 'sevio');

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

  const res = NextResponse.next();

  middlewares.appProfile(req, res);
  middlewares.colorTheme(req, res);
  middlewares.addressFormat(req, res);
  middlewares.scamTokens(req, res);
  middlewares.poorReputationTokens(req, res);

  const end = Date.now();

  const nonce = shouldUseCspNonce ? crypto.randomUUID().replaceAll('-', '') : undefined;
  const cspHeader = await csp.get(req, nonce);

  res.headers.append('Content-Security-Policy', cspHeader);
  res.headers.append('Server-Timing', `middleware;dur=${ end - start }`);
  res.headers.append('Docker-ID', process.env.HOSTNAME || '');

  if (nonce) {
    res.headers.append(CSP_NONCE_HEADER, nonce);
  }

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
