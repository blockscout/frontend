import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { NovesDescribeResponse } from 'types/novesApi';

import config from 'configs/app';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

import useFetch from '../../../lib/hooks/useFetch';

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
  queryOptions?: Omit<UseQueryOptions<NovesDescribeResponse, TranslateError, NovesDescribeResponse>, 'queryKey' | 'queryFn'>;
}

export default function NovesUseFetchDescribe(
  txHash: string | null,
  { queryOptions }: Params = {},
) {
  const fetch = useFetch();

  const url = new URL('/node-api/noves/describe', config.app.baseUrl);

  const body = {
    txHash,
  };

  return useQuery<NovesDescribeResponse, TranslateError, NovesDescribeResponse>({
    queryKey: [ 'describe', txHash, body ],
    queryFn: async() => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      if (!txHash) {
        return undefined as unknown as NovesDescribeResponse;
      }
      return fetch(url.toString(), {
        method: 'POST',
        body,
      }) as Promise<NovesDescribeResponse>;
    },
    ...queryOptions,
  });
}
