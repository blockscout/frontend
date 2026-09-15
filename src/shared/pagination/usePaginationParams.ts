// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import type { NextPageParams } from './types';

import type { PaginatedResourceName, PaginationFilters, PaginationSorting } from 'src/api/resources';
import { SORTING_FIELDS } from 'src/api/resources';
import { getResource } from 'src/api/utils/get-resource';

import getQueryParamString from 'src/shared/router/get-query-param-string';

type Query = NextRouter['query'];
type QueryValue = string | Array<string>;

export interface PaginationUrlParams<Resource extends PaginatedResourceName> {
  readonly page: number;
  readonly cursor: NextPageParams;
  readonly filters: PaginationFilters<Resource>;
  readonly sorting: PaginationSorting<Resource>;
}

export const PAGE_FIELDS = [ 'page', 'next_page_params' ];

const NO_FILTER_FIELDS: Array<string> = [];

export function getFilterFields(resourceName: PaginatedResourceName): Array<string> {
  return getResource(resourceName).filterFields ?? NO_FILTER_FIELDS;
}

export function getPageFromQuery(query: Query): number {
  return query.page && !Array.isArray(query.page) ? Number(query.page) : 1;
}

export function getCursorFromQuery(query: Query): NextPageParams {
  if (!query.next_page_params) {
    return {};
  }

  try {
    return JSON.parse(decodeURIComponent(getQueryParamString(query.next_page_params))) as NextPageParams;
  } catch (error) {
    return {};
  }
}

function pickPresentFields<T = Record<string, QueryValue>>(query: Query, fields: Array<string>): T {
  const result: Record<string, QueryValue> = {};
  for (const field of fields) {
    const value = query[field];
    if (value !== undefined) {
      result[field] = value;
    }
  }
  return result as T;
}

function deriveParams<Resource extends PaginatedResourceName>(query: Query, filterFields: Array<string>): PaginationUrlParams<Resource> {
  return {
    page: getPageFromQuery(query),
    cursor: getCursorFromQuery(query),
    filters: pickPresentFields<PaginationFilters<Resource>>(query, filterFields),
    sorting: pickPresentFields<PaginationSorting<Resource>>(query, SORTING_FIELDS),
  };
}

export function usePaginationParams<Resource extends PaginatedResourceName>(resourceName: Resource): PaginationUrlParams<Resource> {
  const router = useRouter();
  const filterFields = getFilterFields(resourceName);
  const relevantQuery = JSON.stringify(pickPresentFields(router.query, [ ...PAGE_FIELDS, ...filterFields, ...SORTING_FIELDS ]));

  return React.useMemo(
    () => deriveParams<Resource>(JSON.parse(relevantQuery) as Query, filterFields),
    [ relevantQuery, filterFields ],
  );
}
