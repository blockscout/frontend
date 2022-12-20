import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Charts } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';
import type { StatsIntervalIds } from 'types/client/stats';

import useFetch from 'lib/hooks/useFetch';

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
  const fetch = useFetch();

  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const url = `/node-api/stats/charts?name=${ id }${ startDate ? `&from=${ startDate }&to=${ endDate }` : '' }`;

  const { data, isLoading } = useQuery<unknown, unknown, Charts>(
    [ QueryKeys.charts, id, startDate ],
    async() => await fetch(url),
  );

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
