import type { ChainStatsChart, ChainStatsSection } from '../types/client';
import type { GetMessagePathsResponse } from '@blockscout/interchain-indexer-types';
import type { LineChart } from '@blockscout/stats-types';

export const CHAIN_STATS_CHART_INFO: ChainStatsChart = {
  id: 'chart_0',
  title: 'Average transaction fee',
  description: 'The average amount in ETH spent per transaction',
  units: 'ETH',
  resolutions: [ 'DAY', 'MONTH' ],
};

export const CHAIN_STATS_CHARTS_SECTION: ChainStatsSection = {
  id: 'placeholder',
  title: 'Placeholder',
  charts: [
    CHAIN_STATS_CHART_INFO,
    {
      id: 'chart_1',
      title: 'Transactions fees',
      description: 'Amount of tokens paid as fees',
      units: 'ETH',
      resolutions: [ 'DAY', 'MONTH' ],
    },
    {
      id: 'chart_2',
      title: 'New transactions',
      description: 'New transactions number',
      units: undefined,
      resolutions: [ 'DAY', 'MONTH' ],
    },
    {
      id: 'chart_3',
      title: 'Transactions growth',
      description: 'Cumulative transactions number',
      units: undefined,
      resolutions: [ 'DAY', 'MONTH' ],
    },
  ],
};

export const CHAIN_STATS_CHARTS_SECTION_GAS: ChainStatsSection = {
  id: 'gas',
  title: 'Gas',
  charts: [ {
    id: 'averageGasPrice',
    title: 'Average gas price',
    description: 'Average gas price',
    units: 'ETH',
    resolutions: [ 'DAY', 'MONTH' ],
  } ],
};

export const CHAIN_STATS_CHARTS = {
  sections: [ CHAIN_STATS_CHARTS_SECTION ],
};

export const CHAIN_STATS_LINE_CHART: LineChart = {
  info: CHAIN_STATS_CHART_INFO,
  chart: [],
};

export const CHAIN_STATS_CROSS_CHAIN_TXS_PATHS_CHART: GetMessagePathsResponse = {
  items: [],
};
