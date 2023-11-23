import { useQuery } from '@tanstack/react-query';

import type { ResourceError, ResourceName, ResourcePayload } from './resources';
import type { Params } from './useApiQuery';
import { getResourceKey } from './useApiQuery';
import useUniversalProfileApiFetch from './useUniversalProfileApiFetch';

export default function useUniversalProfileQuery<R extends ResourceName, E = unknown>(
  resource: R,
  { queryOptions, pathParams, queryParams }: Params<R, E> = {},
) {
  const upFetch = useUniversalProfileApiFetch();

  return useQuery<ResourcePayload<R>, ResourceError<E>, ResourcePayload<R>>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: getResourceKey(resource, { pathParams, queryParams }),
    queryFn: async() => {
      return upFetch(queryParams) as Promise<ResourcePayload<R>>;
    },
    ...queryOptions,
  });
}
