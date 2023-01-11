import type { StatsSection } from 'types/client/stats';

export const statsChartsScheme: Array<StatsSection> = [
  {
    id: 'accounts',
    title: 'Accounts',
    charts: [
      {
        apiId: 'activeAccounts',
        title: 'Active accounts',
        description: 'Active accounts number per period',
      },
      {
        apiId: 'accountsGrowth',
        title: 'Accounts growth',
        description: 'Cumulative accounts number per period',
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    charts: [
      {
        apiId: 'averageTxnFee',
        title: 'Average transaction fee',
        description: 'The average amount in USD spent per transaction',
      },
      {
        apiId: 'txnsFee',
        title: 'Transactions fees',
        description: 'Amount of tokens paid as fees',
      },
      {
        apiId: 'newTxns',
        title: 'New transactions',
        description: 'New transactions number',
      },
      {
        apiId: 'txnsGrowth',
        title: 'Transactions growth',
        description: 'Cumulative transactions number',
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Blocks',
    charts: [
      {
        apiId: 'newBlocks',
        title: 'New blocks',
        description: 'New blocks number',
      },
      {
        apiId: 'averageBlockSize',
        title: 'Average block size',
        description: 'Average size of blocks in bytes',
      },
    ],
  },
  {
    id: 'tokens',
    title: 'Tokens',
    charts: [
      {
        apiId: 'nativeCoinHoldersGrowth',
        title: 'Native coin holders growth',
        description: 'Cumulative token holders number for the period',
      },
      {
        apiId: 'newNativeCoinTransfers',
        title: 'New native coins transfers',
        description: 'New token transfers number for the period',
      },
      {
        apiId: 'nativeCoinSupply',
        title: 'Native coin circulating supply',
        description: 'Amount of token circulating supply for the period',
      },
    ],
  },
  {
    id: 'gas',
    title: 'Gas',
    charts: [
      {
        apiId: 'averageGasLimit',
        title: 'Average gas limit',
        description: 'Average gas limit per block for the period',
      },
      {
        apiId: 'gasUsedGrowth',
        title: 'Gas used growth',
        description: 'Cumulative gas used for the period',
      },
      {
        apiId: 'averageGasPrice',
        title: 'Average gas price',
        description: 'Average gas price for the period (Gwei)',
      },
    ],
  },
];
