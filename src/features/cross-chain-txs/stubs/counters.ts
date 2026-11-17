// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as stats from '@blockscout/stats-types';

import type { CrossChainCounterId } from '../hooks/useCrossChainCountersQuery';

const COUNTER_IDS = [
  'totalInterchainMessages',
  'newMessagesInterchain24h',
  'totalInterchainTransfers',
  'newTransfersInterchain24h',
] satisfies Array<CrossChainCounterId>;

export const CROSS_CHAIN_COUNTERS: stats.Counters = {
  counters: COUNTER_IDS.map((id) => ({ id, value: '10823', title: '', description: '' })),
};
