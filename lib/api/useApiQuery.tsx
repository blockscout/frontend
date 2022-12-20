import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { RESOURCES, ResourcePayload, ResourceError } from './resources';
import type { Params as ApiFetchParams } from './useApiFetch';
import useApiFetch from './useApiFetch';

interface Params<R extends keyof typeof RESOURCES> extends ApiFetchParams {
  queryOptions?: Omit<UseQueryOptions<unknown, ResourceError, ResourcePayload<R>>, 'queryKey' | 'queryFn'>;
}

export default function useApiQuery<R extends keyof typeof RESOURCES>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams }: Params<R> = {},
) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError, ResourcePayload<R>>([ resource ], async() => {
    return apiFetch(resource, { pathParams, queryParams, fetchParams });
  }, queryOptions);
}
