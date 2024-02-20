import type { ArrayElement } from 'types/utils';

export const ROLLUP_TYPES = [
  'optimistic',
  'shibarium',
  'zkEvm',
] as const;

export type RollupType = ArrayElement<typeof ROLLUP_TYPES>;
