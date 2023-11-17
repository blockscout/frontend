import type { ArrayElement } from 'types/utils';

export const SINGLE_IDENTICON_TYPES = [
  'github',
  'jazzicon',
  'gradient_avatar',
  'blockie',
] as const;

export const makeUniversalProfileIdenticonsUnions = () => {
  return SINGLE_IDENTICON_TYPES.map((identicon) => {
    return `universal_profile|${ identicon }`;
  });
};

export const IDENTICON_TYPES = [
  ...SINGLE_IDENTICON_TYPES,
  ...makeUniversalProfileIdenticonsUnions(),
] as const;

export type IdenticonType = ArrayElement<typeof IDENTICON_TYPES>;

export const ADDRESS_VIEWS_IDS = [
  'top_accounts',
] as const;

export type AddressViewId = ArrayElement<typeof ADDRESS_VIEWS_IDS>;
