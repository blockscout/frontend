import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ResponseData } from 'types/translateApi';

import config from 'configs/app';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

import useFetch from './useFetch';

export interface ApiFetchParams {
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export interface TranslateError {
  payload?: {
    txHash: string;
  };
  status: Response['status'];
  statusText: Response['statusText'];
}

interface Params extends ApiFetchParams {
  queryOptions?: Omit<UseQueryOptions<ResponseData, TranslateError, ResponseData>, 'queryKey' | 'queryFn'>;
}

export default function useFetchTranslate(
  txHash: string | null,
  { queryOptions }: Params = {},
) {
  const fetch = useFetch();

  const url = new URL('/node-api/translate', config.app.baseUrl);

  const body = {
    txHash,
  };

  return useQuery<ResponseData, TranslateError, ResponseData>({
    queryKey: [ 'translate', txHash, body ],
    queryFn: async() => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      if (!txHash) {
        return undefined as unknown as ResponseData;
      }
      return fetch(url.toString(), {
        method: 'POST',
        body,
      }) as Promise<ResponseData>;
    },
    ...queryOptions,
  });
}
