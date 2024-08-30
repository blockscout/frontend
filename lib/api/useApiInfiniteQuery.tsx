import type { InfiniteData, QueryKey, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useInfiniteQuery, type UseInfiniteQueryOptions } from '@tanstack/react-query';

import type { PaginatedResources, ResourceError, ResourcePayload } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import type { Params as ApiFetchParams } from 'lib/api/useApiFetch';

import { getResourceKey } from './useApiQuery';

type TQueryData<R extends PaginatedResources> = ResourcePayload<R>;
type TError = ResourceError<unknown>;
type TPageParam<R extends PaginatedResources> = ApiFetchParams<R>['queryParams'] | null;

export interface Params<R extends PaginatedResources> {
  resourceName: R;
  // eslint-disable-next-line max-len
  queryOptions?: Omit<UseInfiniteQueryOptions<TQueryData<R>, TError, InfiniteData<TQueryData<R>>, TQueryData<R>, QueryKey, TPageParam<R>>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>;
  pathParams?: ApiFetchParams<R>['pathParams'];
}

type ReturnType<Resource extends PaginatedResources> = UseInfiniteQueryResult<InfiniteData<ResourcePayload<Resource>>, ResourceError<unknown>>;

export default function useApiInfiniteQuery<R extends PaginatedResources>({
  resourceName,
  queryOptions,
  pathParams,
}: Params<R>): ReturnType<R> {
  const apiFetch = useApiFetch();

  return useInfiniteQuery<TQueryData<R>, TError, InfiniteData<TQueryData<R>>, QueryKey, TPageParam<R>>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: getResourceKey(resourceName, { pathParams }),
    queryFn: (context) => {
      const queryParams = 'pageParam' in context ? (context.pageParam || undefined) : undefined;
      return apiFetch(resourceName, { pathParams, queryParams }) as Promise<TQueryData<R>>;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_params as TPageParam<R>;
    },
    ...queryOptions,
  });
}
