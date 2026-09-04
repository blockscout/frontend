// SPDX-License-Identifier: LicenseRef-Blockscout

// What an OP Stack chain calls its sub-second pre-confirmation blocks. Chains are split between
// the legacy "Flashblocks" name and the newer "Subblocks" name while running the same wire
// protocol, so the operator picks the label per deployment via NEXT_PUBLIC_FLASHBLOCKS_NAME.
export const FLASHBLOCKS_NAMES = [
  'flashblock',
  'subblock',
] as const;

export type FlashblocksName = (typeof FLASHBLOCKS_NAMES)[number];
