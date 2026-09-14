// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { hashKey, keepPreviousData } from '@tanstack/react-query';
import React from 'react';

import type { NextPageParams, PaginationParams } from './types';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { Params as UseApiQueryParams } from 'src/api/hooks/useApiQuery';
import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { PaginatedResourceName, ResourceError, ResourcePayload } from 'src/api/resources';

import { useShallowStable } from 'src/shared/hooks/useShallowStable';
import { setPrototypeState, usePageTransitionPrototype } from 'src/shared/lists/page-transition-prototype/store';

import type { PaginationActions } from './usePaginationActions';
import { usePaginationActions } from './usePaginationActions';
import type { PaginationUrlParams } from './usePaginationParams';
import { usePaginationParams } from './usePaginationParams';

export interface Params<Resource extends PaginatedResourceName> {
  readonly resourceName: Resource;
  readonly options?: UseApiQueryParams<Resource>['queryOptions'];
  readonly queryParams?: UseApiQueryParams<Resource>['queryParams'];
  readonly pathParams?: UseApiQueryParams<Resource>['pathParams'];
  readonly scrollRef?: React.RefObject<HTMLDivElement | null>;
  readonly hasNextPageFn?: (nextPageParams: NextPageParams) => boolean;
  readonly chain?: ExternalChainExtended;
  readonly noScroll?: boolean;
}

export type ApiPaginatedQueryResult<Resource extends PaginatedResourceName> =
  UseQueryResult<ResourcePayload<Resource>, ResourceError<unknown>> &
  Pick<PaginationUrlParams<Resource>, 'filters' | 'sorting'> &
  Pick<PaginationActions<Resource>, 'onFilterChange' | 'onSortingChange'> &
  {
    readonly pagination: PaginationParams;
    readonly queryHash: string;
    readonly isInitialLoading: boolean;
    readonly isTransitioning: boolean;
  };

type ResourceQueryParams = NonNullable<UseApiQueryParams<PaginatedResourceName>['queryParams']>;

function getNextPageParams<R extends PaginatedResourceName>(data: ResourcePayload<R> | undefined): NextPageParams | undefined {
  if (!data || typeof data !== 'object' || !('next_page_params' in data)) {
    return;
  }

  return (data.next_page_params ?? undefined) as NextPageParams | undefined;
}

function hasMoreItems(nextPageParams: NextPageParams | undefined, hasNextPageFn: Params<PaginatedResourceName>['hasNextPageFn']): boolean {
  if (!nextPageParams) {
    return false;
  }

  return hasNextPageFn ? hasNextPageFn(nextPageParams) : Object.keys(nextPageParams).length > 0;
}

export default function useApiPaginatedQuery<Resource extends PaginatedResourceName>({
  resourceName,
  options,
  pathParams,
  queryParams: queryParamsFromProps,
  scrollRef,
  noScroll,
  hasNextPageFn,
  chain,
}: Params<Resource>): ApiPaginatedQueryResult<Resource> {
  const { page, cursor, filters, sorting } = usePaginationParams(resourceName);

  const queryParams = { ...cursor, ...filters, ...sorting, ...queryParamsFromProps } as ResourceQueryParams;
  const resolvedQueryParams = Object.keys(queryParams).length ? queryParams : undefined;

  const queryHash = hashKey(getResourceKey(resourceName, {
    pathParams,
    queryParams: resolvedQueryParams,
    chainId: chain?.id,
  }));

  // PROTOTYPE (#3697 T13): keep the previous page's rows only when the list itself (everything but the
  // cursor) is unchanged since the last settled data; otherwise fall back to the caller's stub.
  const prototype = usePageTransitionPrototype();
  const listHash = hashKey(getResourceKey(resourceName, {
    pathParams,
    queryParams: { ...filters, ...sorting, ...queryParamsFromProps },
    chainId: chain?.id,
  }));
  const settledListHash = React.useRef<string | undefined>(undefined);
  const keepPrevious = prototype.variant !== 'skeleton' && settledListHash.current === listHash;

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams: resolvedQueryParams,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
      placeholderData: keepPrevious ? keepPreviousData : options?.placeholderData,
    },
    chain,
    delayMs: prototype.latencyMs,
  });

  React.useEffect(() => {
    if (queryResult.data !== undefined && !queryResult.isPlaceholderData) {
      settledListHash.current = listHash;
    }
  }, [ listHash, queryResult.data, queryResult.isPlaceholderData ]);
  const nextPageParams = getNextPageParams(queryResult.data);

  const { canGoBackwards, onNextPageClick, onPrevPageClick, resetPage, onFilterChange, onSortingChange } = usePaginationActions({
    resourceName,
    page,
    cursor,
    nextPageParams,
    scrollRef,
    noScroll,
  });

  const hasNextPage = hasMoreItems(nextPageParams, hasNextPageFn);
  const hasPages = page > 1;
  const isLoading = queryResult.isPlaceholderData;
  const isTransitioning = isLoading && keepPrevious;
  const isInitialLoading = isLoading && !keepPrevious;

  React.useEffect(() => {
    if (options?.enabled !== false) {
      setPrototypeState({ listState: (isTransitioning && 'transitioning') || (isInitialLoading && 'skeleton') || 'idle' });
    }
  }, [ isTransitioning, isInitialLoading, options?.enabled ]);

  const pagination = React.useMemo<PaginationParams>(() => ({
    page,
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    hasPages,
    hasNextPage,
    canGoBackwards,
    isLoading,
    isVisible: hasPages || hasNextPage,
  }), [ page, onNextPageClick, onPrevPageClick, resetPage, hasPages, hasNextPage, canGoBackwards, isLoading ]);

  return useShallowStable({
    ...queryResult,
    pagination,
    onFilterChange,
    onSortingChange,
    filters,
    sorting,
    queryHash,
    isInitialLoading,
    isTransitioning,
  });
}
