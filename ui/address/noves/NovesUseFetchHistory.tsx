import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { NovesAccountHistoryResponse } from 'types/novesApi';

import config from 'configs/app';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

export interface ApiFetchParams {
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export interface TranslateHistory {
  payload?: {
    address: string;
  };
  status: Response['status'];
  statusText: Response['statusText'];
}

interface Params extends ApiFetchParams {
  queryOptions?: Omit<UseQueryOptions<NovesAccountHistoryResponse, TranslateHistory, NovesAccountHistoryResponse>, 'queryKey' | 'queryFn'>;
}

export default function NovesUseFetchHistory(
  address: string | null,
  page: number,
  { queryOptions, queryParams }: Params = {},
) {
  const fetch = useFetch();

  const url = new URL('/node-api/noves/history', config.app.baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  const body = {
    address,
    page,
  };

  return useQuery<NovesAccountHistoryResponse, TranslateHistory, NovesAccountHistoryResponse>({
    queryKey: [ 'history', address, { ...queryParams }, body ],
    queryFn: async() => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      if (!address) {
        return undefined as unknown as NovesAccountHistoryResponse;
      }
      return fetch(url.toString(), {
        method: 'POST',
        body,

      }) as Promise<NovesAccountHistoryResponse>;
    },
    ...queryOptions,
  });
}
