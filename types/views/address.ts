import type { ArrayElement } from 'types/utils';

export const IDENTICON_TYPES = [
  'github',
  'jazzicon',
  'gradient_avatar',
  'blockie',
  'nouns',
] as const;

export type IdenticonType = ArrayElement<typeof IDENTICON_TYPES>;

export const ADDRESS_VIEWS_IDS = [
  'top_accounts',
] as const;

export type AddressViewId = ArrayElement<typeof ADDRESS_VIEWS_IDS>;

export const ADDRESS_FORMATS = [ 'base16', 'bech32' ] as const;
export type AddressFormat = typeof ADDRESS_FORMATS[ number ];
