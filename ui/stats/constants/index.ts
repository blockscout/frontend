import type { StatsIntervalIds } from 'types/client/stats';

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; start?: Date } } = {
  all: {
    title: 'All time',
  },
  oneMonth: {
    title: '1 month',
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: '3 months',
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: '6 months',
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: '1 year',
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}
