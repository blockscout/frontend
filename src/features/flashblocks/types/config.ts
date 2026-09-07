// SPDX-License-Identifier: LicenseRef-Blockscout

export const FLASHBLOCKS_NAMES = [
  'flashblock',
  'subblock',
] as const;

export type FlashblocksName = (typeof FLASHBLOCKS_NAMES)[number];

export const FLASHBLOCKS_TAB_IDS = [
  'flashblocks',
  'subblocks',
] as const;

export type FlashblocksTabId = (typeof FLASHBLOCKS_TAB_IDS)[number];
