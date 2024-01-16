import type { ArrayElement } from 'types/utils';

export const BLOCK_FIELDS_IDS = [
  'burnt_fees',
  'total_reward',
  'nonce',
  'miner',
] as const;

export type BlockFieldId = ArrayElement<typeof BLOCK_FIELDS_IDS>;
