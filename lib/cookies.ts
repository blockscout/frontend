import type { Types } from 'typescript-cookie';
import { Cookies } from 'typescript-cookie';

export enum NAMES {
  NAV_BAR_COLLAPSED='nav_bar_collapsed'
}

export function get(name?: string | undefined | null) {
  return Cookies.get(name);
}

export function set(name: string, value: string, attributes: Types.CookieAttributes = {}) {
  attributes.path = '/';

  return Cookies.set(name, value, attributes);
}
