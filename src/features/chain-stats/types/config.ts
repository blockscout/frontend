// SPDX-License-Identifier: LicenseRef-Blockscout

import type { StatsApiResourceName } from 'src/api/resources/services/stats';

export const STATS_API_RESOURCES_REFETCH_INTERVAL = [
  'stats:counters',
  'stats:pages_main',
] satisfies Array<StatsApiResourceName>;

export type StatsApiResourceNameRefetchInterval = typeof STATS_API_RESOURCES_REFETCH_INTERVAL[number];
