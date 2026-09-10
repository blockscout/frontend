// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { hashKey } from '@tanstack/react-query';
import { omit } from 'es-toolkit';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import type { NextPageParams, PaginationParams } from './types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import type { Params as UseApiQueryParams } from 'src/api/hooks/useApiQuery';
import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { PaginatedResourceName, PaginationFilters, PaginationSorting, ResourceError, ResourcePayload } from 'src/api/resources';

import multichainConfig from 'src/features/multichain/chains-config';
import { useMultichainContext } from 'src/features/multichain/context';
import getChainValueFromQuery from 'src/features/multichain/utils/get-chain-value-from-query';

import { useShallowStable } from 'src/shared/hooks/useShallowStable';

import { scrollListToTop, usePaginationActions } from './usePaginationActions';
import { PAGE_FIELDS, usePaginationParams } from './usePaginationParams';

export interface Params<Resource extends PaginatedResourceName> {
  resourceName: Resource;
  options?: UseApiQueryParams<Resource>['queryOptions'];
  queryParams?: UseApiQueryParams<Resource>['queryParams'];
  pathParams?: UseApiQueryParams<Resource>['pathParams'];
  filters?: PaginationFilters<Resource>;
  sorting?: PaginationSorting<Resource>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  hasNextPageFn?: (nextPageParams: NextPageParams) => boolean;
  isMultichain?: boolean;
  chainIds?: Array<string>;
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
  chainValue: Array<string> | undefined;
  onChainValueChange: ({ value }: { value: Array<string> }) => void;
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

function getSelectedChain(chainId: string | undefined, contextChain: ClusterChainConfig | undefined): ClusterChainConfig | undefined {
  if (contextChain) {
    return contextChain.id === chainId ? contextChain : undefined;
  }

  return multichainConfig()?.chains.find((chain) => chain.id === chainId);
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
  isMultichain,
  chainIds,
}: Params<Resource>): QueryWithPagesResult<Resource> {
  const router = useRouter();
  const multichainContext = useMultichainContext();
  const contextChain = multichainContext?.chain;

  const hasChainValue = Boolean(isMultichain ?? contextChain);
  const chainId = hasChainValue ? getChainValueFromQuery(router.query, chainIds) : undefined;
  const chainValue = React.useMemo(
    () => (hasChainValue ? [ chainId ].filter(Boolean) : undefined),
    [ hasChainValue, chainId ],
  );
  const selectedChain = React.useMemo(
    () => (hasChainValue ? getSelectedChain(chainId, contextChain) : undefined),
    [ hasChainValue, chainId, contextChain ],
  );

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
    chainId: (selectedChain || contextChain)?.id,
  }));

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams: resolvedQueryParams,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
    chain: selectedChain,
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

  const latestRouter = React.useRef<NextRouter>(router);
  latestRouter.current = router;

  const latestScroll = React.useRef({ scrollRef, noScroll, page });
  latestScroll.current = { scrollRef, noScroll, page };

  const onChainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const { pathname, query, push } = latestRouter.current;
    if (latestScroll.current.page !== 1) {
      scrollListToTop(latestScroll.current.scrollRef, latestScroll.current.noScroll);
    }
    push({ pathname, query: { ...omit(query, PAGE_FIELDS), chain_id: value[0] } }, undefined, { shallow: true });
  }, []);

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
    chainValue,
    onChainValueChange,
    queryHash,
    isInitialLoading: isLoading,
    isTransitioning: false,
  });
}
