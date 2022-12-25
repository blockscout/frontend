import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TChainIndicator, ChartsResources } from './types';
import type { TimeChartData } from 'ui/shared/chart/types';

import useApiQuery from 'lib/api/useApiQuery';

export default function useFetchChartData<R extends ChartsResources>(indicator: TChainIndicator<R>): UseQueryResult<TimeChartData> {
  const queryResult = useApiQuery(indicator.api.resourceName, {
    queryOptions: { enabled: Boolean(indicator) },
  });

  return React.useMemo(() => {
    return {
      ...queryResult,
      data: queryResult.data && indicator ? indicator.api.dataFn(queryResult.data) : queryResult.data,
    } as UseQueryResult<TimeChartData>;
  }, [ indicator, queryResult ]);
}
