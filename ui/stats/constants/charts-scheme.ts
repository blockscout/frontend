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
        visible: true,
      },
      {
        id: 'average-block-size',
        title: 'Average block size',
        description: 'Average size of blocks in bytes',
        visible: true,
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    charts: [
      {
        id: 'average-transaction-fee',
        title: 'Average transaction fee',
        description: 'The average amount in USD spent per transaction',
        visible: true,
      },
      {
        id: 'transactions-fees',
        title: 'Transactions fees',
        description: 'Amount of tokens paid as fees',
        visible: true,
      },
      {
        id: 'new-transactions',
        title: 'Transactions fees',
        description: 'New transactions number per period',
        visible: true,
      },
      {
        id: 'transactions-growth',
        title: 'Transactions growth',
        description: 'Cumulative transactions number per period',
        visible: true,
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts',
    charts: [
      {
        id: 'active-accounts',
        title: 'Active accounts',
        description: 'Active accounts number per period',
        visible: true,
      },
      {
        id: 'accounts-growth',
        title: 'Accounts growth',
        description: 'Cumulative accounts number per period',
        visible: true,
      },
    ],
  },
];
