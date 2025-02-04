// useCustomApiQuery.tsx
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type {
  ResourceError,
  ResourceName,
  ResourcePayload,
} from '../resources';
import type { Params as ApiFetchParams } from '../useApiFetch';
import useCustomApiFetch from './useCustomApiFetch';

export interface Params<
  R extends ResourceName,
  E = unknown,
  D = ResourcePayload<R>,
> extends ApiFetchParams<R> {
  queryOptions?: Omit<
    UseQueryOptions<ResourcePayload<R>, ResourceError<E>, D>,
    'queryKey' | 'queryFn'
  >;
}

export function getResourceKey<R extends ResourceName>(
  resource: R,
  { pathParams, queryParams }: Params<R> = {},
) {
  if (pathParams || queryParams) {
    return [ resource, { ...pathParams, ...queryParams } ];
  }

  return [ resource ];
}

export default function useCustomApiQuery<R, E = unknown>(
  url: string,
  queryOptions = {},
) {
  const apiFetch = useCustomApiFetch();

  return useQuery<R, E>({
    // Use the URL string as the query key
    queryKey: [ url ],
    queryFn: async() => {
      // Use the apiFetch to fetch data from the given URL
      return apiFetch(url) as Promise<R>;
    },
    ...queryOptions,
  });
}
