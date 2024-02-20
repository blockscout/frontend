import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';
import type { TimeChartData } from 'ui/shared/chart/types';

import type { ResourcePayload } from 'lib/api/resources';

export type ChartsResources = 'stats_charts_txs' | 'stats_charts_market';

export interface TChainIndicator<R extends ChartsResources> {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  icon: React.ReactNode;
  hint?: string;
  api: {
    resourceName: R;
    dataFn: (response: ResourcePayload<R>) => TimeChartData;
  };
}
