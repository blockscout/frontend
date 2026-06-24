// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type ScrollL2BlockStatus = NonNullable<schemas['Transaction']['scroll']>['l2_block_status'];

export const SCROLL_L2_BLOCK_STATUSES: Array<ScrollL2BlockStatus> = [
  'Confirmed by Sequencer' as const,
  'Committed' as const,
  'Finalized' as const,
];
