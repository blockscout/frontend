import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import type { RESOURCES, ResourcePayload, ResourceError } from './resources';

export default function useApi<R extends keyof typeof RESOURCES>(
  resource: R,
  queryOptions?: Omit<UseQueryOptions<unknown, ResourceError, ResourcePayload<R>>, 'queryKey' | 'queryFn'>,
) {
  const fetch = useFetch();

  return useQuery<unknown, ResourceError, ResourcePayload<R>>([ resource ], async() => {
    const url = buildUrl(resource);
    return fetch(url, { credentials: 'include' });
  }, queryOptions);
}
