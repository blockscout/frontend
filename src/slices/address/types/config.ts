// SPDX-License-Identifier: LicenseRef-Blockscout

export const IDENTICON_TYPES = [
  'github',
  'jazzicon',
  'gradient_avatar',
  'blockie',
  'nouns',
] as const;

export type IdenticonType = typeof IDENTICON_TYPES[number];

export const ADDRESS_VIEWS_IDS = [
  'top_accounts',
] as const;

export type AddressViewId = typeof ADDRESS_VIEWS_IDS[number];

export const ADDRESS_FORMATS = [ 'base16', 'bech32' ] as const;
export type AddressFormat = typeof ADDRESS_FORMATS[ number ];
