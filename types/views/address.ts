import type { ArrayElement } from 'types/utils';

export const IDENTICON_TYPES = [
  'github',
  'jazzicon',
  'gradient_avatar',
  'blockie',
] as const;

export type IdenticonType = ArrayElement<typeof IDENTICON_TYPES>;
