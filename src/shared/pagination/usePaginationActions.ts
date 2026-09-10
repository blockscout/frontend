// SPDX-License-Identifier: LicenseRef-Blockscout

import { omit } from 'es-toolkit';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';
import { animateScroll } from 'react-scroll';

import type { NextPageParams } from './types';

import type { PaginatedResourceName, PaginationFilters, PaginationSorting } from 'src/api/resources';
import { SORTING_FIELDS } from 'src/api/resources';

import { getFilterFields, PAGE_FIELDS } from './usePaginationParams';

type Query = NextRouter['query'];

export interface PaginationActionsParams<Resource extends PaginatedResourceName> {
  readonly resourceName: Resource;
  readonly page: number;
  readonly cursor: NextPageParams;
  readonly nextPageParams: NextPageParams | undefined;
  readonly scrollRef: React.RefObject<HTMLDivElement | null> | undefined;
  readonly noScroll: boolean | undefined;
}

export interface PaginationActions<Resource extends PaginatedResourceName> {
  readonly onNextPageClick: () => void;
  readonly onPrevPageClick: () => void;
  readonly resetPage: () => void;
  readonly onFilterChange: <R extends PaginatedResourceName = Resource>(filters: PaginationFilters<R> | undefined) => void;
  readonly onSortingChange: (sorting?: PaginationSorting<Resource>) => void;
  readonly canGoBackwards: boolean;
}

interface LatestInputs<Resource extends PaginatedResourceName> extends PaginationActionsParams<Resource> {
  readonly router: NextRouter;
}

type PageCursors = Record<number, NextPageParams>;

export function encodeCursor(cursor: NextPageParams): string {
  return encodeURIComponent(JSON.stringify(cursor));
}

export function scrollListToTop(scrollRef: React.RefObject<HTMLDivElement | null> | undefined, noScroll: boolean | undefined): void {
  if (noScroll) {
    return;
  }
  scrollRef?.current ? scrollRef.current.scrollIntoView(true) : animateScroll.scrollToTop({ duration: 0 });
}

function isMeaningfulFilterValue(value: unknown): boolean {
  return typeof value === 'boolean' || (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0);
}

function toQueryValue(value: unknown): string {
  return Array.isArray(value) ? value.join(',') : String(value);
}

export function usePaginationActions<Resource extends PaginatedResourceName>(params: PaginationActionsParams<Resource>): PaginationActions<Resource> {
  const router = useRouter();

  const latest = React.useRef<LatestInputs<Resource>>({ ...params, router });
  latest.current = { ...params, router };

  const cursorsRef = React.useRef<PageCursors | null>(null);
  if (cursorsRef.current === null) {
    cursorsRef.current = { [params.page]: params.cursor };
  }

  const navigate = React.useCallback((query: Query) => {
    const { router, scrollRef, noScroll } = latest.current;
    scrollListToTop(scrollRef, noScroll);
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  }, []);

  const goToFirstPage = React.useCallback((query: Query) => {
    cursorsRef.current = {};
    navigate(omit(query, PAGE_FIELDS));
  }, [ navigate ]);

  const onNextPageClick = React.useCallback(() => {
    const { router, page, cursor, nextPageParams } = latest.current;
    if (!nextPageParams) {
      return;
    }

    const cursors = cursorsRef.current ?? {};
    cursors[page] = cursor;
    cursors[page + 1] = nextPageParams;
    cursorsRef.current = cursors;

    navigate({ ...router.query, page: String(page + 1), next_page_params: encodeCursor(nextPageParams) });
  }, [ navigate ]);

  const onPrevPageClick = React.useCallback(() => {
    const { router, page } = latest.current;
    const previousPage = page - 1;
    const previousCursor = cursorsRef.current?.[previousPage];

    if (previousPage <= 1 || !previousCursor) {
      goToFirstPage(router.query);
      return;
    }

    navigate({ ...router.query, page: String(previousPage), next_page_params: encodeCursor(previousCursor) });
  }, [ goToFirstPage, navigate ]);

  const resetPage = React.useCallback(() => {
    goToFirstPage(latest.current.router.query);
  }, [ goToFirstPage ]);

  const onFilterChange = React.useCallback(<R extends PaginatedResourceName = Resource>(filters: PaginationFilters<R> | undefined) => {
    const { router, resourceName } = latest.current;
    const query: Query = omit(router.query, getFilterFields(resourceName));

    Object.entries(filters ?? {}).forEach(([ key, value ]) => {
      if (isMeaningfulFilterValue(value)) {
        query[key] = toQueryValue(value);
      }
    });

    goToFirstPage(query);
  }, [ goToFirstPage ]);

  const onSortingChange = React.useCallback((sorting?: PaginationSorting<Resource>) => {
    const { router } = latest.current;
    goToFirstPage({ ...omit(router.query, SORTING_FIELDS), ...sorting });
  }, [ goToFirstPage ]);

  return React.useMemo(() => ({
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    onFilterChange,
    onSortingChange,
    canGoBackwards: Boolean(cursorsRef.current?.[params.page - 1]),
  }), [ onNextPageClick, onPrevPageClick, resetPage, onFilterChange, onSortingChange, params.page ]);
}
