// SPDX-License-Identifier: LicenseRef-Blockscout

export const BLOCK_FIELDS_IDS = [
  'base_fee',
  'burnt_fees',
  'total_reward',
  'nonce',
  'miner',
  'L1_status',
  'batch',
] as const;

export type BlockFieldId = (typeof BLOCK_FIELDS_IDS)[number];
