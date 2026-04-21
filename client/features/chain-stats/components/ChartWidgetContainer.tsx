import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import type { StatsIntervalIds } from '../types/client';

import { route, type Route } from 'nextjs-routes';

import config from 'configs/app';
import { ChartResolution } from 'toolkit/components/charts';
import { SankeyChartWidget } from 'toolkit/components/charts/sankey/SankeyChartWidget';

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
  const { query } = useChartQuery({ id, resolution: ChartResolution.DAY, interval, enabled: !isLoading });

  useEffect(() => {
    if (query.isError) {
      onLoadingError();
    }
  }, [ query.isError, onLoadingError ]);

  const chartUrl = href ? `${ config.app.baseUrl }${ route(href) }` : undefined;

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
        chartUrl={ chartUrl }
      />
    );
  }

  if (query.data?.type === 'sankey') {
    return (
      <SankeyChartWidget
        data={ query.data.data }
        title={ title }
        description={ description }
        isLoading={ query.isPlaceholderData }
        isError={ query.isError }
        href={ href ? route(href) : undefined }
        chartUrl={ chartUrl }
        containerProps={{ minH: '230px', className }}
      />
    );
  }

  return null;
};

export default chakra(ChartWidgetContainer);
