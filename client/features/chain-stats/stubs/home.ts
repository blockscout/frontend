import type * as stats from '@blockscout/stats-types';

import { CHAIN_STATS_CHART_INFO } from 'client/features/chain-stats/stubs/charts';
import { CHAIN_STATS_COUNTER } from 'client/features/chain-stats/stubs/counters';

export const HOMEPAGE_STATS_MICROSERVICE: stats.MainPageStats = {
  average_block_time: CHAIN_STATS_COUNTER,
  total_addresses: CHAIN_STATS_COUNTER,
  total_blocks: CHAIN_STATS_COUNTER,
  total_transactions: CHAIN_STATS_COUNTER,
  yesterday_transactions: CHAIN_STATS_COUNTER,
  total_operational_transactions: CHAIN_STATS_COUNTER,
  yesterday_operational_transactions: CHAIN_STATS_COUNTER,
  daily_new_transactions: {
    chart: [],
    info: { ...CHAIN_STATS_CHART_INFO, title: 'Daily transactions' },
  },
  daily_new_operational_transactions: {
    chart: [],
    info: { ...CHAIN_STATS_CHART_INFO, title: 'Daily op txns' },
  },
};
