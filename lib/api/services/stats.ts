import type { ApiResource } from '../types';
import type * as stats from '@blockscout/stats-types';

// TODO @tom2drum remove prefix from resource names
export const STATS_API_RESOURCES = {
  stats_counters: {
    path: '/api/v1/counters',
  },
  stats_lines: {
    path: '/api/v1/lines',
  },
  stats_line: {
    path: '/api/v1/lines/:id',
    pathParams: [ 'id' as const ],
  },
  stats_main: {
    path: '/api/v1/pages/main',
  },
  stats_transactions: {
    path: '/api/v1/pages/transactions',
  },
  stats_contracts: {
    path: '/api/v1/pages/contracts',
  },
} satisfies Record<string, ApiResource>;

export type StatsApiResourceName = `stats:${ keyof typeof STATS_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type StatsApiResourcePayload<R extends StatsApiResourceName> =
R extends 'stats:stats_counters' ? stats.Counters :
R extends 'stats:stats_lines' ? stats.LineCharts :
R extends 'stats:stats_line' ? stats.LineChart :
R extends 'stats:stats_main' ? stats.MainPageStats :
R extends 'stats:stats_transactions' ? stats.TransactionsPageStats :
R extends 'stats:stats_contracts' ? stats.ContractsPageStats :
never;
/* eslint-enable @stylistic/indent */
