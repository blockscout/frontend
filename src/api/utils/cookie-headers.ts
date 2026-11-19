// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiName } from '../types';

import * as cookies from 'src/shared/storage/cookies';

export interface CookieHeaderDescriptor {
  header: string;
  cookie: cookies.NAMES;

  // 'value' — send the cookie value as is; 'flag' — send 'true' only when the cookie value is exactly 'true'
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
