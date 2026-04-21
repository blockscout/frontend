import type { StatsIntervalIds } from '../types/client';
import { ChartResolution } from 'toolkit/components/charts/types';

export const DEFAULT_RESOLUTION = ChartResolution.DAY;

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; shortTitle: string; start?: Date } } = {
  all: {
    title: 'All time',
    shortTitle: 'All time',
  },
  oneMonth: {
    title: '1 month',
    shortTitle: '1M',
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: '3 months',
    shortTitle: '3M',
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: '6 months',
    shortTitle: '6M',
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: '1 year',
    shortTitle: '1Y',
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}
