import type { Counter, HomeStats, StatsChartsSection } from 'types/api/stats';

export const HOMEPAGE_STATS: HomeStats = {
  average_block_time: 14346,
  coin_price: '1807.68',
  gas_prices: {
    average: 0.1,
    fast: 0.11,
    slow: 0.1,
  },
  gas_used_today: '0',
  market_cap: '0',
  network_utilization_percentage: 22.56,
  static_gas_price: null,
  total_addresses: '28634064',
  total_blocks: '8940150',
  total_gas_used: '0',
  total_transactions: '193823272',
  transactions_today: '0',
  tvl: '1767425.102766552',
};

export const STATS_CHARTS_SECTION: StatsChartsSection = {
  id: 'placeholder',
  title: 'Placeholder',
  charts: [
    {
      id: 'chart_0',
      title: 'Average transaction fee',
      description: 'The average amount in ETH spent per transaction',
      units: 'ETH',
    },
    {
      id: 'chart_1',
      title: 'Transactions fees',
      description: 'Amount of tokens paid as fees',
      units: 'ETH',
    },
    {
      id: 'chart_2',
      title: 'New transactions',
      description: 'New transactions number',
      units: null,
    },
    {
      id: 'chart_3',
      title: 'Transactions growth',
      description: 'Cumulative transactions number',
      units: null,
    },
  ],
};

export const STATS_CHARTS = {
  sections: [ STATS_CHARTS_SECTION ],
};

export const STATS_COUNTER: Counter = {
  id: 'stub',
  value: '9074405',
  title: 'Placeholder Counter',
  description: 'Placeholder description',
  units: '',
};
