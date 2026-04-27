import React from 'react';

import type { LineChart } from '@blockscout/stats-types';
import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import { getDateLabel } from 'toolkit/components/charts/utils/getDateLabel';
import { STATS_INTERVALS } from 'ui/stats/constants';

import { formatDate } from './utils';

export default function useChartQuery(id: string, resolution: Resolution, interval: StatsIntervalIds, enabled = true) {
  const { apiData } = useAppContext<'/stats/[id]'>();

  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const [ info, setInfo ] = React.useState<LineChart['info']>(apiData || undefined);

  const lineQuery = useApiQuery('stats:line', {
    pathParams: { id },
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
    },
  });

  React.useEffect(() => {
    if (!info && lineQuery.data?.info && !lineQuery.isPlaceholderData) {
      // save info to keep title and description when change query params
      setInfo(lineQuery.data?.info);
    }
  }, [ info, lineQuery.data?.info, lineQuery.isPlaceholderData ]);

  const items = React.useMemo(() => lineQuery.data?.chart?.map((item) => {
    const date = new Date(item.date);
    const dateTo = new Date(item.date_to);
    // For resolution greater than day, we have to use the date_to field to display X labels correctly
    const dateFormatted = resolution === Resolution.DAY ? date : new Date(item.date_to ?? item.date);
    return {
      date_to: dateTo,
      value: Number(item.value),
      isApproximate: item.is_approximate,
      date: dateFormatted,
      dateLabel: getDateLabel(date, dateTo, resolution),
    };
  }), [ lineQuery.data?.chart, resolution ]);

  return {
    items,
    info,
    lineQuery,
  };
}
