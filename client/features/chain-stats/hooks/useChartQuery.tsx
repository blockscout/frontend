import { uniqBy } from 'es-toolkit';
import React from 'react';

import type { ChartData, StatsIntervalIds } from '../types/client';
import type { GetMessagePathsResponse } from '@blockscout/interchain-indexer-types';
import type { LineChart } from '@blockscout/stats-types';
import type { ChartResolution } from 'toolkit/components/charts/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import { formatDate } from 'ui/shared/chart/utils';

import { CROSS_CHAIN_TXS_CHARTS } from '../utils/additional-charts';
import { STATS_INTERVALS } from '../utils/consts';

const isLineChartResponse = (data: unknown): data is LineChart => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Boolean('info' in data && data.info && 'chart' in data && data.chart);
};

const isMessagePathsResponse = (data: unknown): data is GetMessagePathsResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Boolean('items' in data && Array.isArray(data.items) && data.items.length > 0);
};

interface Props {
  id: string;
  resolution: ChartResolution;
  interval: StatsIntervalIds;
  enabled?: boolean;
}

export default function useChartQuery({ id, resolution, interval, enabled = true }: Props) {
  const { apiData } = useAppContext<'/stats/[id]'>();

  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const [ info, setInfo ] = React.useState<LineChart['info']>(apiData || undefined);

  const additionalChart = CROSS_CHAIN_TXS_CHARTS.find((chart) => chart.id === id);
  const resourceName = additionalChart?.resourceName ? additionalChart.resourceName : 'stats:line';

  const query = useApiQuery<typeof resourceName, unknown, ChartData | undefined>(resourceName, {
    pathParams: { id, chainId: config.chain.id },
    queryParams: {
      from: startDate,
      to: endDate,
      resolution,
    },
    queryOptions: {
      enabled: enabled,
      refetchOnMount: false,
      placeholderData: {
        info: {
          title: 'Chart title placeholder',
          description: 'Chart placeholder description chart placeholder description',
          resolutions: [ 'DAY', 'WEEK', 'MONTH', 'YEAR' ],
          id: 'placeholder',
          units: undefined,
        },
        chart: [],
      },
      select: (data) => {
        if (isLineChartResponse(data)) {
          return {
            type: 'line',
            info: data.info,
            data: data.chart.map((item) => {
              return {
                date: new Date(item.date),
                date_to: new Date(item.date_to),
                value: Number(item.value),
                isApproximate: item.is_approximate,
              };
            }),
          };
        }
        if (isMessagePathsResponse(data) && additionalChart) {

          const chains = uniqBy(data.items.flatMap((item) => [ item.source_chain, item.destination_chain ]).filter(Boolean), (chain) => chain?.id);

          return {
            info: {
              title: additionalChart.title,
              description: additionalChart.description,
              id: id,
              resolutions: [],
            },
            type: 'sankey',
            data: {
              nodes: chains.map((chain) => ({ id: chain.id, name: chain.name })),
              links: data.items
                .map((item) => {
                  if (!item.source_chain?.id || !item.destination_chain?.id) {
                    return null;
                  }
                  return { source: item.source_chain.id, target: item.destination_chain.id, value: item.messages_count };
                })
                .filter(Boolean),
            },
          };
        }
      },
    },
  });

  React.useEffect(() => {
    if (!info && query.data?.info && !query.isPlaceholderData) {
      // save info to keep title and description when change query params
      setInfo(query.data?.info);
    }
  }, [ info, query.data?.info, query.isPlaceholderData ]);

  return {
    info,
    query,
  };
}
