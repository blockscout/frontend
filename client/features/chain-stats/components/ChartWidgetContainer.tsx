import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import type { StatsIntervalIds } from '../types/client';
import { Resolution } from '@blockscout/stats-types';

import { route, type Route } from 'nextjs-routes';

import config from 'configs/app';
import { SankeyChart } from 'toolkit/components/charts/sankey/SankeyChart';

import useChartQuery from '../hooks/useChartQuery';
import ChartWidgetContainerLine from './ChartWidgetContainerLine';

interface Props {
  id: string;
  title: string;
  description: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isLoading: boolean;
  className?: string;
  href?: Route;
};

const ChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  isLoading,
  className,
  href,
}: Props) => {
  const { query } = useChartQuery({ id, resolution: Resolution.DAY, interval, enabled: !isLoading });

  useEffect(() => {
    if (query.isError) {
      onLoadingError();
    }
  }, [ query.isError, onLoadingError ]);

  if (query.data?.type === 'line') {
    return (
      <ChartWidgetContainerLine
        data={ query.data.data }
        id={ id }
        units={ query.data.info?.units }
        title={ title }
        description={ description }
        isLoading={ query.isPlaceholderData }
        isError={ query.isError }
        minH="230px"
        className={ className }
        href={ href ? route(href) : undefined }
        chartUrl={ href ? `${ config.app.baseUrl }${ route(href) }` : undefined }
      />
    );
  }

  if (query.data?.type === 'sankey') {
    return (
      <SankeyChart
        key={ id }
        data={ query.data.data }
      />
    );
  }

  return null;
};

export default chakra(ChartWidgetContainer);
