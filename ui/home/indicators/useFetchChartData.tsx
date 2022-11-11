import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TChainIndicator, ChartsResponse, ChartsQueryKeys, ChainIndicatorChartData } from './types';

import useFetch from 'lib/hooks/useFetch';

type NotUndefined<T> = T extends undefined ? never : T;

export default function useFetchCharData<Q extends ChartsQueryKeys>(indicator: TChainIndicator<Q> | undefined): UseQueryResult<ChainIndicatorChartData> {
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
    } as UseQueryResult<ChainIndicatorChartData>;
  }, [ indicator, queryResult ]);
}
