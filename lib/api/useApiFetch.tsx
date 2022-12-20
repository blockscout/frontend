import React from 'react';

import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import type { RESOURCES, ResourceError } from './resources';

export interface Params {
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  fetchParams?: Pick<FetchParams, 'body' | 'method'>;
}

export default function useApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<R extends keyof typeof RESOURCES, SuccessType = unknown, ErrorType = ResourceError>(
    resource: R,
    { pathParams, queryParams, fetchParams }: Params = {},
  ) => {
    const url = buildUrl(resource, pathParams, queryParams);
    return fetch<SuccessType, ErrorType>(url, { credentials: 'include', ...fetchParams });
  }, [ fetch ]);
}
