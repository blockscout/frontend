// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiName } from '../types';

import * as cookies from 'src/shared/storage/cookies';

// Request headers that are derived from cookies at request time.
//
// This list is the single source of truth for two producers that must emit identical headers:
//  - the client fetch layer (src/api/utils/build-headers.ts), which resolves the descriptors
//    against js-cookie;
//  - the early-fetch primer (src/server/primedRequests), whose inline script resolves them
//    against document.cookie before the JS bundle boots.
// The primed-fetch consumer (src/api/utils/primed-fetch.ts) compares the results at runtime
// and falls back to a network request on any mismatch.

export interface CookieHeaderDescriptor {
  header: string;
  cookie: cookies.NAMES;

  /** 'value' — send the cookie value as is; 'flag' — send 'true' only when the cookie value is exactly 'true' */
  kind: 'value' | 'flag';
}

export function getCookieHeaderDescriptors(apiName: ApiName): Array<CookieHeaderDescriptor> {
  if (apiName === 'core') {
    return [
      { header: 'api-v2-temp-token', cookie: cookies.NAMES.API_TEMP_TOKEN, kind: 'value' },
      { header: 'show-scam-tokens', cookie: cookies.NAMES.SHOW_SCAM_TOKENS, kind: 'flag' },
    ];
  }

  return [];
}

export function resolveCookieHeaders(descriptors: Array<CookieHeaderDescriptor>): Record<string, string | undefined> {
  return Object.fromEntries(descriptors.map(({ header, cookie, kind }) => {
    const value = cookies.get(cookie);

    if (kind === 'flag') {
      return [ header, value === 'true' ? 'true' : undefined ];
    }

    return [ header, value ];
  }));
}
