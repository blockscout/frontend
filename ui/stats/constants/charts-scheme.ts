import type { StatsSection } from 'types/client/stats';

export const statsChartsScheme: Array<StatsSection> = [
  {
    id: 'blocks',
    title: 'Blocks',
    charts: [
      {
        id: 'new-blocks',
        title: 'New blocks',
        description: 'New blocks number per day',
        apiMethodURL: '/node-api/stats/charts/transactions',
      },
      {
        id: 'average-block-size',
        title: 'Average block size',
        description: 'Average size of blocks in bytes per day',
        apiMethodURL: '/node-api/stats/charts/transactions',
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    charts: [
      {
        id: 'transaction-fees',
        title: 'Transaction fees',
        description: 'Amount of tokens paid as fees per day',
        apiMethodURL: '/node-api/stats/charts/transactions',
      },
      {
        id: 'native-coin-holders-growth',
        title: 'Native coin holders growth',
        description: 'Total token holders number per day',
        apiMethodURL: '/node-api/stats/charts/transactions',
      },
    ],
  },
];
