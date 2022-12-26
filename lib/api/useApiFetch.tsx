import React from 'react';

import appConfig from 'configs/app/config';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import { RESOURCES } from './resources';
import type { ResourceError, ApiResource } from './resources';

export interface Params {
  pathParams?: Record<string, string | undefined>;
  queryParams?: Record<string, string | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method'>;
}

export default function useApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<R extends keyof typeof RESOURCES, SuccessType = unknown, ErrorType = ResourceError>(
    resourceName: R,
    { pathParams, queryParams, fetchParams }: Params = {},
  ) => {
    const resource: ApiResource = RESOURCES[resourceName];
    const url = buildUrl(resource, pathParams, queryParams);
    return fetch<SuccessType, ErrorType>(url, {
      credentials: 'include',
      ...(resource.endpoint && appConfig.host === 'localhost' ? {
        headers: {
          'x-endpoint': resource.endpoint,
        },
      } : {}),
      ...fetchParams,
    });
  }, [ fetch ]);
}
