import React from 'react';

import isNeedProxy from 'lib/api/isNeedProxy';
import * as cookies from 'lib/cookies';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams }: Params<R> = {},
  ) => {
    const resource: ApiResource = RESOURCES[resourceName];
    const url = buildUrl(resourceName, pathParams, queryParams);
    return fetch<SuccessType, ErrorType>(
      url,
      {
        credentials: 'include',
        ...(resource.endpoint ? {
          headers: {
            ...(isNeedProxy() ? { 'x-endpoint': resource.endpoint } : {}),
            ...(resource.needAuth ? { Authorization: cookies.get(cookies.NAMES.API_TOKEN) } : {}),
          },
        } : {}),
        ...fetchParams,
      },
      {
        resource: resource.path,
      },
    );
  }, [ fetch ]);
}
