import { useQuery } from '@tanstack/react-query';

import type { TChainIndicator, ChartsResponse, ChartsQueryKeys, ChainIndicatorChartData } from './types';

import useFetch from 'lib/hooks/useFetch';

type NotUndefined<T> = T extends undefined ? never : T;

export default function useFetchCharData<Q extends ChartsQueryKeys>(indicator: TChainIndicator<Q> | undefined) {
  const fetch = useFetch();

  type ResponseType = ChartsResponse<NotUndefined<typeof indicator>['api']['queryName']>;

  return useQuery<unknown, unknown, ChainIndicatorChartData>(
    [ indicator?.api.queryName ],
    () => {
      return fetch<ResponseType, unknown>(indicator?.api.path || '')
        .then((result) => {
          if ('status' in result) {
            return Promise.reject(result);
          }

          return indicator?.api.dataFn(result);
        });
    },
    { enabled: Boolean(indicator) },
  );
}
