import { sub } from 'date-fns';

import type { ChartPrecisionIds } from 'types/api/stats';
import type { StatsSectionIds, StatsIntervalIds } from 'types/client/stats';

export const STATS_SECTIONS: { [key in StatsSectionIds]?: string } = {
  all: 'All stats',
  accounts: 'Accounts',
  blocks: 'Blocks',
  transactions: 'Transactions',
  gas: 'Gas',
};

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; precision: ChartPrecisionIds; start?: Date } } = {
  all: {
    title: 'All time',
    precision: 'MONTH',
  },
  oneMonth: {
    title: '1 month',
    precision: 'DAY',
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: '3 months',
    precision: 'DAY',
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: '6 months',
    precision: 'MONTH',
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: '1 year',
    precision: 'MONTH',
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  return sub(new Date(), { months });
}
