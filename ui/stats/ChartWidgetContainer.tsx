import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import type { Route } from 'nextjs-routes';

import useChartQuery from 'ui/shared/chart/useChartQuery';

import ChartWidget from '../shared/chart/ChartWidget';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const ChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  units,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const { items, lineQuery } = useChartQuery(id, Resolution.DAY, interval, !isPlaceholderData);

  useEffect(() => {
    if (lineQuery.isError) {
      onLoadingError();
    }
  }, [ lineQuery.isError, onLoadingError ]);

  return (
    <ChartWidget
      isError={ lineQuery.isError }
      items={ items }
      title={ title }
      units={ units }
      description={ description }
      isLoading={ lineQuery.isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href }
    />
  );
};

export default chakra(ChartWidgetContainer);
