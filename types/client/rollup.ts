import type { ArrayElement } from 'types/utils';

export const ROLLUP_TYPES = [
  'optimistic',
  'zkEvm',
] as const;

export type RollupType = ArrayElement<typeof ROLLUP_TYPES>;
