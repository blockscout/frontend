// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface NewBlockSocketResponse {
  average_block_time: string;
  block: schemas['BlockResponse'];
}

export interface NewBlockCountSocketResponse {
  count: number;
  type: schemas['BlockResponse']['type'];
}

export interface BlockFilters {
  type?: schemas['BlockResponse']['type'];
}

export interface BlockCountdownResponse {
  result: {
    CountdownBlock: string;
    CurrentBlock: string;
    EstimateTimeInSec: string;
    RemainingBlock: string;
  } | null;
}
