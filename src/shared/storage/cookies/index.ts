// SPDX-License-Identifier: LicenseRef-Blockscout

import Cookies from 'js-cookie';

import config from 'src/config';

import { NAMES, PRIVATE_MODE_DISALLOWED } from './consts';
import { get, getFromCookieString, isPrivateMode } from './read';

export { NAMES, PRIVATE_MODE_DISALLOWED, get, getFromCookieString, isPrivateMode };

interface DefaultAttributes {
  readonly path: string;
  readonly secure: boolean;
}

export const getDefaultAttributes = (): DefaultAttributes => ({
  path: '/',
  secure: config.app.protocol === 'https',
});

function isDisallowedInPrivateMode(name: NAMES): boolean {
  return PRIVATE_MODE_DISALLOWED.includes(name);
}

export function set(name: NAMES, value: string, attributes: Cookies.CookieAttributes = {}, serverCookie?: string): string | undefined {
  // Check if we're in private mode and this cookie is disallowed
  if (isPrivateMode(serverCookie) && isDisallowedInPrivateMode(name)) {
    // Don't set the cookie in private mode
    return;
  }

  return Cookies.set(name, value, { ...getDefaultAttributes(), ...attributes });
}

export function remove(name: NAMES, attributes: Cookies.CookieAttributes = {}): void {
  return Cookies.remove(name, { ...getDefaultAttributes(), ...attributes });
}
