import { useQueryClient } from '@tanstack/react-query';
import _pickBy from 'lodash/pickBy';
import React from 'react';

import type { CsrfData } from 'types/client/account';

import isBodyAllowed from 'lib/api/isBodyAllowed';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
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
  const queryClient = useQueryClient();
  const { token: csrfToken } = queryClient.getQueryData<CsrfData>(getResourceKey('csrf')) || {};

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams }: Params<R> = {},
  ) => {
    const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

    const resource: ApiResource = RESOURCES[resourceName];
    const url = buildUrl(resourceName, pathParams, queryParams);
    const withBody = isBodyAllowed(fetchParams?.method);
    const headers = _pickBy({
      'x-endpoint': resource.endpoint && isNeedProxy() ? resource.endpoint : undefined,
      Authorization: resource.endpoint && resource.needAuth ? apiToken : undefined,
      'x-csrf-token': withBody && csrfToken ? csrfToken : undefined,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      url,
      {
        credentials: 'include',
        headers,
        ...fetchParams,
      },
      {
        resource: resource.path,
      },
    );
  }, [ fetch, csrfToken ]);
}
