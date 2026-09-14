// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as stats from '@blockscout/stats-types';

const COUNTER_IDS = [
  'totalInterchainMessages',
  'newMessagesInterchain24h',
  'totalInterchainTransfers',
  'newTransfersInterchain24h',
];

export const CROSS_CHAIN_COUNTERS: stats.Counters = {
  counters: COUNTER_IDS.map((id) => ({ id, value: '10823', title: '', description: '' })),
};
