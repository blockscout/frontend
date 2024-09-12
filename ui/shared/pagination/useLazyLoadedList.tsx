import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import type { PaginatedResources, ResourceError, ResourcePayload } from 'lib/api/resources';
import type { Params as ApiInfiniteQueryParams } from 'lib/api/useApiInfiniteQuery';
import useApiInfiniteQuery from 'lib/api/useApiInfiniteQuery';

interface Params<Resource extends PaginatedResources> extends ApiInfiniteQueryParams<Resource> {
  rootRef: React.RefObject<HTMLElement>;
}

interface ReturnType<Resource extends PaginatedResources> {
  cutRef: (node?: Element | null) => void;
  query: UseInfiniteQueryResult<InfiniteData<ResourcePayload<Resource>>, ResourceError<unknown>>;
}

export default function useLazyLoadedList<Resource extends PaginatedResources>({
  rootRef,
  resourceName,
  queryOptions,
  pathParams,
}: Params<Resource>): ReturnType<Resource> {
  const query = useApiInfiniteQuery({
    resourceName,
    pathParams,
    queryOptions,
  });

  const { ref, inView } = useInView({
    root: rootRef.current,
    triggerOnce: false,
    skip: queryOptions?.enabled === false || query.isFetchingNextPage || !query.hasNextPage,
  });

  React.useEffect(() => {
    if (inView) {
      query.fetchNextPage();
    }
    // should run only on inView state change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ inView ]);

  return { cutRef: ref, query };
}
