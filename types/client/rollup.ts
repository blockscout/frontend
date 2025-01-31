import type { ArrayElement } from 'types/utils';

export const ROLLUP_TYPES = [
  'optimistic',
  'arbitrum',
  'shibarium',
  'zkEvm',
  'zkSync',
  'scroll',
] as const;

export type RollupType = ArrayElement<typeof ROLLUP_TYPES>;
