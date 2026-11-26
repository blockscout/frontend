// SPDX-License-Identifier: LicenseRef-Blockscout

// Keep this module free of `src/config` imports, direct or transitive: the app config reads the app profile from here
// while it is still initializing, and an import back into the config is a cycle that fails when this module loads first.

import Cookies from 'js-cookie';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import { NAMES } from './consts';

export function get(name?: NAMES | undefined | null, serverCookie?: string) {
  if (!isBrowser()) {
    return serverCookie ? getFromCookieString(serverCookie, name) : undefined;
  }

  if (name) {
    return Cookies.get(name);
  }
}

export function getFromCookieString(cookieString: string, name?: NAMES | undefined | null) {
  return cookieString.split(`${ name }=`)[1]?.split(';')[0];
}

export function isPrivateMode(serverCookie?: string): boolean {
  const appProfile = get(NAMES.APP_PROFILE, serverCookie);
  return appProfile === 'private';
}
