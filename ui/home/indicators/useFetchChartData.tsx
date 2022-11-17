import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TChainIndicator, ChartsResponse, ChartsQueryKeys } from './types';
import type { TimeChartData } from 'ui/shared/chart/types';

import useFetch from 'lib/hooks/useFetch';

type NotUndefined<T> = T extends undefined ? never : T;

export default function useFetchCharData<Q extends ChartsQueryKeys>(indicator: TChainIndicator<Q> | undefined): UseQueryResult<TimeChartData> {
  const fetch = useFetch();

  type ResponseType = ChartsResponse<NotUndefined<typeof indicator>['api']['queryName']>;

  const queryResult = useQuery<unknown, unknown, ResponseType>(
    [ indicator?.api.queryName ],
    () => fetch(indicator?.api.path || ''),
    { enabled: Boolean(indicator) },
  );

  return React.useMemo(() => {
    return {
      ...queryResult,
      data: queryResult.data && indicator ? indicator.api.dataFn(queryResult.data) : queryResult.data,
    } as UseQueryResult<TimeChartData>;
  }, [ indicator, queryResult ]);
}
