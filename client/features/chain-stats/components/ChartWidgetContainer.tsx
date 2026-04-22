import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { StatsIntervalIds } from '../types/client';

import { route, type Route } from 'nextjs-routes';

import { ChartResolution } from 'toolkit/components/charts';
import { LineChartWidget } from 'toolkit/components/charts/line/LineChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

import useChartQuery from '../hooks/useChartQuery';
import { getChartUrl } from '../utils/chart';

export interface Props {
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
  const query = useChartQuery({ id, resolution: ChartResolution.DAY, interval, enabled: !isLoading });

  React.useEffect(() => {
    if (query.isError) {
      onLoadingError();
    }
  }, [ query.isError, onLoadingError ]);

  const chartsConfig = useChartsConfig();

  const data = query.data?.data;
  const units = query.data?.info?.units;

  const charts = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return [
      {
        id,
        name: 'Value',
        items: data,
        charts: chartsConfig,
        units,
      },
    ];
  }, [ data, id, chartsConfig, units ]);

  return (
    <LineChartWidget
      id={ id }
      charts={ charts }
      title={ title }
      description={ description }
      isLoading={ query.isPlaceholderData }
      isError={ query.isError }
      minH="230px"
      className={ className }
      href={ href ? route(href) : undefined }
      chartUrl={ getChartUrl(href) }
    />
  );
};

export default chakra(ChartWidgetContainer);
