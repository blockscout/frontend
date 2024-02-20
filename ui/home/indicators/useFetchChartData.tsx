import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TChainIndicator, ChartsResources } from './types';
import type { TimeChartData } from 'ui/shared/chart/types';

import type { ResourcePayload } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';

export default function useFetchChartData<R extends ChartsResources>(indicator: TChainIndicator<R> | undefined): UseQueryResult<TimeChartData> {
  const queryResult = useApiQuery(indicator?.api.resourceName || 'stats_charts_txs', {
    queryOptions: { enabled: Boolean(indicator) },
  });

  return React.useMemo(() => {
    return {
      ...queryResult,
      data: queryResult.data && indicator ? indicator.api.dataFn(queryResult.data as ResourcePayload<R>) : queryResult.data,
    } as UseQueryResult<TimeChartData>;
  }, [ indicator, queryResult ]);
}
