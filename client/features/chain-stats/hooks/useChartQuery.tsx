import type { ChartDataPayloadLine, StatsIntervalIds } from '../types/client';
import { ChartResolution } from 'toolkit/components/charts/types';

import useApiQuery from 'lib/api/useApiQuery';
import { getDateLabel } from 'toolkit/components/charts/line/utils/getDateLabel';

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
            const date = new Date(item.date);
            const dateTo = item.date_to ? new Date(item.date_to) : undefined;
            // For resolution greater than day, we have to use the date_to field to display X labels correctly
            const dateFormatted = resolution === ChartResolution.DAY ? date : dateTo ?? date;

            return {
              date: dateFormatted,
              date_to: dateTo,
              value: Number(item.value),
              isApproximate: item.is_approximate,
              dateLabel: getDateLabel(date, dateTo, resolution),
            };
          }),
        };
      },
    },
  });
}
