import React from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';

import ChartWidget from '../shared/chart/ChartWidget';
import { STATS_INTERVALS } from './constants';

type Props = {
  id: string;
  title: string;
  description: string;
  interval: StatsIntervalIds;
}

function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

const ChartWidgetContainer = ({ id, title, description, interval }: Props) => {
  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const { data, isLoading } = useApiQuery('stats_charts', {
    queryParams: {
      name: id,
      from: startDate,
      to: endDate,
    },
  });

  const items = data?.chart
    .map((item) => {
      return { date: new Date(item.date), value: Number(item.value) };
    });

  return (
    <ChartWidget
      items={ items }
      title={ title }
      description={ description }
      isLoading={ isLoading }
    />
  );
};

export default ChartWidgetContainer;
