import type { NextRouter } from 'next/router';

import { StatsIntervalId, type StatsIntervalIds } from '../types/client';
import { ChartResolution } from 'toolkit/components/charts/types';

import getQueryParamString from 'lib/router/getQueryParamString';
import { formatDate } from 'ui/shared/chart/utils';

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

export function getDatesFromInterval(interval: StatsIntervalIds): { start?: string; end?: string } {
  const selectedInterval = STATS_INTERVALS[interval];

  if (!selectedInterval.start) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  return {
    start: formatDate(selectedInterval.start),
    end: formatDate(new Date()),
  };
}

export function getIntervalFromQuery(router: NextRouter): StatsIntervalIds | undefined {
  const intervalFromQuery = getQueryParamString(router.query.interval);

  if (!intervalFromQuery || !Object.values(StatsIntervalId).includes(intervalFromQuery as StatsIntervalIds)) {
    return undefined;
  }

  return intervalFromQuery as StatsIntervalIds;
};

export function getIntervalByResolution(resolution: ChartResolution): StatsIntervalIds {
  switch (resolution) {
    case ChartResolution.DAY:
      return 'oneMonth';
    case ChartResolution.WEEK:
      return 'oneMonth';
    case ChartResolution.MONTH:
      return 'oneYear';
    case ChartResolution.YEAR:
      return 'all';
    default:
      return 'oneMonth';
  }
};
