import Cookies from 'js-cookie';

import { isBrowser } from 'toolkit/utils/isBrowser';

/**
 * Cookies that are disallowed in private mode.
 * These cookies should not be set when app profile is 'private'.
 */
export enum PRIVATE_MODE_DISALLOWED {
  UUID = 'uuid',
  ADBLOCK_DETECTED = 'adblock_detected',
  MIXPANEL_DEBUG = '_mixpanel_debug',
}

/**
 * All cookie names that can be used in the application.
 */
export enum NAMES {
  NAV_BAR_COLLAPSED = 'nav_bar_collapsed',
  API_TOKEN = '_explorer_key',
  REWARDS_API_TOKEN = 'rewards_api_token',
  REWARDS_REFERRAL_CODE = 'rewards_ref_code',
  TXS_SORT = 'txs_sort',
  COLOR_MODE = 'chakra-ui-color-mode',
  COLOR_THEME = 'chakra-ui-color-theme',
  ADDRESS_IDENTICON_TYPE = 'address_identicon_type',
  ADDRESS_FORMAT = 'address_format',
  TIME_FORMAT = 'time_format',
  INDEXING_ALERT = 'indexing_alert',
  ADBLOCK_DETECTED = 'adblock_detected',
  MIXPANEL_DEBUG = '_mixpanel_debug',
  ADDRESS_NFT_DISPLAY_TYPE = 'address_nft_display_type',
  UUID = 'uuid',
  SHOW_SCAM_TOKENS = 'show_scam_tokens',
  APP_PROFILE = 'app_profile',
}

export function get(name?: NAMES | undefined | null, serverCookie?: string) {
  if (!isBrowser()) {
    return serverCookie ? getFromCookieString(serverCookie, name) : undefined;
  }

  if (name) {
    return Cookies.get(name);
  }
}

/**
 * Checks if a cookie is disallowed in private mode.
 */
function isDisallowedInPrivateMode(name: NAMES): boolean {
  return Object.values(PRIVATE_MODE_DISALLOWED).includes(name);
}

/**
 * Checks if the app is currently in private mode by reading the APP_PROFILE cookie.
 */
function isPrivateMode(serverCookie?: string): boolean {
  const appProfile = get(NAMES.APP_PROFILE, serverCookie);
  return appProfile === 'private';
}

export function set(name: NAMES, value: string, attributes: Cookies.CookieAttributes = {}, serverCookie?: string) {
  // Check if we're in private mode and this cookie is disallowed
  if (isPrivateMode(serverCookie) && isDisallowedInPrivateMode(name)) {
    // Don't set the cookie in private mode
    return;
  }

  attributes.path = '/';

  return Cookies.set(name, value, attributes);
}

export function remove(name: NAMES, attributes: Cookies.CookieAttributes = {}) {
  return Cookies.remove(name, attributes);
}

export function getFromCookieString(cookieString: string, name?: NAMES | undefined | null) {
  return cookieString.split(`${ name }=`)[1]?.split(';')[0];
}
