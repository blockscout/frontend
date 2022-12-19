import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import type { RESOURCES, ResourcePayload, ResourceError } from './resources';

interface Params<R extends keyof typeof RESOURCES> {
  queryOptions?: Omit<UseQueryOptions<unknown, ResourceError, ResourcePayload<R>>, 'queryKey' | 'queryFn'>;
}

export default function useApiQuery<R extends keyof typeof RESOURCES>(
  resource: R,
  { queryOptions }: Params<R> = {},
) {
  const fetch = useFetch();

  return useQuery<unknown, ResourceError, ResourcePayload<R>>([ resource ], async() => {
    const url = buildUrl(resource);
    return fetch(url, { credentials: 'include' });
  }, queryOptions);
}
