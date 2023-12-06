import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { AccountHistoryResponse } from 'types/translateApi';

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
  queryOptions?: Omit<UseQueryOptions<AccountHistoryResponse, TranslateHistory, AccountHistoryResponse>, 'queryKey' | 'queryFn'>;
}

export default function useFetchHistory(
  address: string | null,
  page: number,
  { queryOptions, queryParams }: Params = {},
) {
  const fetch = useFetch();

  const url = new URL('/node-api/history', config.app.baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  const body = {
    address,
    page,
  };

  return useQuery<AccountHistoryResponse, TranslateHistory, AccountHistoryResponse>({
    queryKey: [ 'history', address, { ...queryParams }, body ],
    queryFn: async() => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      if (!address) {
        return undefined as unknown as AccountHistoryResponse;
      }
      return fetch(url.toString(), {
        method: 'POST',
        body,

      }) as Promise<AccountHistoryResponse>;
    },
    ...queryOptions,
  });
}
