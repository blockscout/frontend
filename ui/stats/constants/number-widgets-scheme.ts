import type { Stats } from 'types/api/stats';

type Key = keyof Stats['counters'];

export const numberWidgetsScheme: Array<{id: Key; title: string}> = [
  {
    id: 'totalBlocks',
    title: 'Total blocks',
  },
  {
    id: 'averageBlockTime',
    title: 'Average block time',
  },
  {
    id: 'totalTransactions',
    title: 'Total transactions',
  },
  {
    id: 'completedTransactions',
    title: 'Completed transactions',
  },
  {
    id: 'totalAccounts',
    title: 'Total accounts',
  },
  {
    id: 'totalTokens',
    title: 'Total tokens',
  },
  {
    id: 'totalNativeCoinHolders',
    title: 'Total native coin holders',
  },
  {
    id: 'totalNativeCoinTransfers',
    title: 'Total native coin transfers',
  },
  {
    id: 'totalAccounts',
    title: 'Total accounts',
  },
];
