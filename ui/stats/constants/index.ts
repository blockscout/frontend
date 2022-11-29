import type { StatsSectionIds, StatsIntervalIds } from 'types/client/stats';

export const STATS_SECTIONS: { [key in StatsSectionIds]?: string } = {
  all: 'All stats',
  accounts: 'Accounts',
  blocks: 'Blocks',
  transactions: 'Transactions',
  gas: 'Gas',
};

export const STATS_INTERVALS: { [key in StatsIntervalIds]: string } = {
  all: 'All time',
  oneMonth: '1 month',
  threeMonths: '3 months',
  sixMonths: '6 months',
  oneYear: '1 year',
};
