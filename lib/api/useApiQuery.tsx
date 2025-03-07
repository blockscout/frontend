import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

import type { ResourceError, ResourceName, ResourcePathParams, ResourcePayload } from './resources';
import useApiFetch from './useApiFetch';

export interface Params<R extends ResourceName, E = unknown, D = ResourcePayload<R>> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'headers'>;
  queryOptions?: Partial<Omit<UseQueryOptions<ResourcePayload<R>, ResourceError<E>, D>, 'queryFn'>>;
  logError?: boolean;
}

export function getResourceKey<R extends ResourceName>(resource: R, { pathParams, queryParams }: Params<R> = {}) {
  if (pathParams || queryParams) {
    return [ resource, { ...pathParams, ...queryParams } ];
  }

  return [ resource ];
}

export default function useApiQuery<R extends ResourceName, E = unknown, D = ResourcePayload<R>>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams, logError }: Params<R, E, D> = {},
) {
  const apiFetch = useApiFetch();

  return useQuery<ResourcePayload<R>, ResourceError<E>, D>({
    queryKey: queryOptions?.queryKey || getResourceKey(resource, { pathParams, queryParams }),
    queryFn: async({ signal }) => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      return apiFetch(resource, { pathParams, queryParams, logError, fetchParams: { ...fetchParams, signal } }) as Promise<ResourcePayload<R>>;
    },
    ...queryOptions,
  });
}
