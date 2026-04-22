import type { ChartDataPayloadLine, StatsIntervalIds } from '../types/client';
import type { ChartResolution } from 'toolkit/components/charts/types';

import useApiQuery from 'lib/api/useApiQuery';

import { CHAIN_STATS_LINE_CHART } from '../stubs/charts';
import { getDatesFromInterval } from '../utils/interval';

interface Props {
  id: string;
  resolution: ChartResolution;
  interval: StatsIntervalIds;
  enabled?: boolean;
}

export default function useChartQuery({ id, resolution, interval, enabled = true }: Props) {

  const { start: startDate, end: endDate } = getDatesFromInterval(interval);
  const resourceName = 'stats:line';

  return useApiQuery<typeof resourceName, unknown, ChartDataPayloadLine | undefined>(resourceName, {
    pathParams: { id },
    queryParams: {
      from: startDate,
      to: endDate,
      resolution,
    },
    queryOptions: {
      enabled: enabled,
      refetchOnMount: false,
      placeholderData: (prevData) => {
        return prevData ?? CHAIN_STATS_LINE_CHART;
      },
      select: (data) => {
        return {
          type: 'line',
          info: data.info ?? {
            id: id,
            title: 'Chart title',
            description: 'Chart description',
            resolutions: [ ],
          },
          data: data.chart.map((item) => {
            return {
              date: new Date(item.date),
              date_to: new Date(item.date_to),
              value: Number(item.value),
              isApproximate: item.is_approximate,
            };
          }),
        };
      },
    },
  });
}
