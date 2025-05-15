import { useQueryClient } from '@tanstack/react-query';
import { omit, pickBy } from 'es-toolkit';
import React from 'react';

import type { CsrfData } from 'types/client/account';

import config from 'configs/app';
import isBodyAllowed from 'lib/api/isBodyAllowed';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import getResourceParams from './getResourceParams';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined | null>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
  logError?: boolean;
}

export default function useApiFetch() {
  const fetch = useFetch();
  const queryClient = useQueryClient();
  const { token: csrfToken } = queryClient.getQueryData<CsrfData>(getResourceKey('general:csrf')) || {};

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams, logError }: Params<R> = {},
  ) => {
    const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

    const { api, apiName, resource } = getResourceParams(resourceName);
    const url = buildUrl(resourceName, pathParams, queryParams);
    const withBody = isBodyAllowed(fetchParams?.method);
    const headers = pickBy({
      'x-endpoint': api.endpoint && apiName !== 'general' && isNeedProxy() ? api.endpoint : undefined,
      Authorization: [ 'admin', 'contractInfo' ].includes(apiName) ? apiToken : undefined,
      'x-csrf-token': withBody && csrfToken ? csrfToken : undefined,
      ...resource.headers,
      ...fetchParams?.headers,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      url,
      {
        // as of today, we use cookies only
        //    for user authentication in My account
        //    for API rate-limits (cannot use in the condition though, but we agreed with devops team that should not be an issue)
        // change condition here if something is changed
        credentials: config.features.account.isEnabled ? 'include' : 'same-origin',
        headers,
        ...(fetchParams ? omit(fetchParams, [ 'headers' ]) : {}),
      },
      {
        resource: resource.path,
        logError,
      },
    );
  }, [ fetch, csrfToken ]);
}
