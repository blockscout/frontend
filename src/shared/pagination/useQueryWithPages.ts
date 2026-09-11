// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { hashKey } from '@tanstack/react-query';
import React from 'react';

import type { NextPageParams, PaginationParams } from './types';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { Params as UseApiQueryParams } from 'src/api/hooks/useApiQuery';
import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { PaginatedResourceName, PaginationFilters, PaginationSorting, ResourceError, ResourcePayload } from 'src/api/resources';

import { useShallowStable } from 'src/shared/hooks/useShallowStable';

import { usePaginationActions } from './usePaginationActions';
import { usePaginationParams } from './usePaginationParams';

export interface Params<Resource extends PaginatedResourceName> {
  resourceName: Resource;
  options?: UseApiQueryParams<Resource>['queryOptions'];
  queryParams?: UseApiQueryParams<Resource>['queryParams'];
  pathParams?: UseApiQueryParams<Resource>['pathParams'];
  filters?: PaginationFilters<Resource>;
  sorting?: PaginationSorting<Resource>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  hasNextPageFn?: (nextPageParams: NextPageParams) => boolean;
  chain?: ExternalChainExtended;
  noScroll?: boolean;
}

export type QueryWithPagesResult<Resource extends PaginatedResourceName> =
UseQueryResult<ResourcePayload<Resource>, ResourceError<unknown>> &
{
  onFilterChange: <R extends PaginatedResourceName = Resource>(filters: PaginationFilters<R>) => void;
  onSortingChange: (sorting?: PaginationSorting<Resource>) => void;
  pagination: PaginationParams;
  filters: PaginationFilters<Resource>;
  sorting: PaginationSorting<Resource>;
  queryHash: string;
  isInitialLoading: boolean;
  isTransitioning: boolean;
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

export default function useQueryWithPages<Resource extends PaginatedResourceName>({
  resourceName,
  filters: filtersProp,
  sorting: sortingProp,
  options,
  pathParams,
  queryParams: queryParamsFromProps,
  scrollRef,
  noScroll,
  hasNextPageFn,
  chain,
}: Params<Resource>): QueryWithPagesResult<Resource> {
  const { page, cursor, filters: filtersFromUrl, sorting: sortingFromUrl } = usePaginationParams(resourceName);
  const filters = filtersProp ?? filtersFromUrl;
  const sorting = sortingProp ?? sortingFromUrl;

  const queryParams = { ...cursor, ...filters, ...sorting, ...queryParamsFromProps } as ResourceQueryParams;
  const resolvedQueryParams = Object.keys(queryParams).length ? queryParams : undefined;

  // Exposed as `queryHash` so list components can use it as the `resetKey` for useLazyRenderedList:
  // it changes on filter/pagination/chain changes but is stable across in-place cache updates
  // (socket prepends via setQueryData), which is exactly when the render window should / shouldn't reset.
  const queryHash = hashKey(getResourceKey(resourceName, {
    pathParams,
    queryParams: resolvedQueryParams,
    chainId: chain?.id,
  }));

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams: resolvedQueryParams,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
    chain,
  });
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
    isInitialLoading: isLoading,
    isTransitioning: false,
  });
}
