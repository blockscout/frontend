import { useQueryClient } from '@tanstack/react-query';
import { omit, pickBy } from 'es-toolkit';
import React from 'react';

import type { ApiName } from './types';
import type { CsrfData } from 'types/client/account';
import type { ChainConfig } from 'types/multichain';

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

function needCredentials(apiName: ApiName) {
  if (![ 'general' ].includes(apiName)) {
    return false;
  }

  // currently, the cookies are used only for the following features
  if (
    config.features.account.isEnabled ||
    config.UI.views.token.hideScamTokensEnabled
  ) {
    return true;
  }

  return false;
}

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined | null>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
  logError?: boolean;
  chain?: ChainConfig;
}

export default function useApiFetch() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  const { token: csrfToken } = queryClient.getQueryData<CsrfData>(getResourceKey('general:csrf')) || {};

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams, logError, chain }: Params<R> = {},
  ) => {
    const apiToken = cookies.get(cookies.NAMES.API_TOKEN);
    const { api, apiName, resource } = getResourceParams(resourceName, chain);
    const url = buildUrl(resourceName, pathParams, queryParams, undefined, chain);
    const withBody = isBodyAllowed(fetchParams?.method);
    const headers = pickBy({
      'x-endpoint': isNeedProxy() ? api.endpoint : undefined,
      Authorization: [ 'admin', 'contractInfo' ].includes(apiName) ? apiToken : undefined,
      'x-csrf-token': withBody && csrfToken ? csrfToken : undefined,
      ...resource.headers,
      ...fetchParams?.headers,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      url,
      {
        credentials: needCredentials(apiName) ? 'include' : 'same-origin',
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
