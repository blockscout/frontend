// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { omit } from 'es-toolkit';
import React from 'react';

import type { CsrfData } from 'src/features/account/types/client';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { ResourceName, ResourcePathParams } from '../resources';
import buildHeaders from '../utils/build-headers';
import buildUrl from '../utils/build-url';
import getResourceParams from '../utils/get-resource-params';
import { getResourceKey } from './useApiQuery';
import type { Params as FetchParams } from './useFetch';
import useFetch from './useFetch';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined | null>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
  logError?: boolean;
  chain?: ExternalChainExtended;
}

export default function useApiFetch() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  const { token: csrfToken } = queryClient.getQueryData<CsrfData>(getResourceKey('core:csrf')) || {};

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams, logError, chain }: Params<R> = {},
  ) => {
    const { resource } = getResourceParams(resourceName, chain);
    const url = buildUrl(resourceName, pathParams, queryParams, undefined, chain);
    const headers = buildHeaders(resourceName, {
      chain,
      csrfToken,
      method: fetchParams?.method,
      extraHeaders: fetchParams?.headers,
    });

    return fetch<SuccessType, ErrorType>(
      url,
      {
        // Things to remember:
        //
        // A: Currently, we use only one API-related cookie, "_explorer_key," which is for the account feature.
        // We include credentials only for core API requests.
        // Note that some APIs may share the same origin with the core API, but they don't require credentials (e.g the Stats API).
        //
        // B: We cannot limit the routes for which credentials should be sent exclusively to the "/account/**" routes.
        // This is because the watchlist names and private tags preloading will not function on the API side.
        // Therefore, we include credentials for all core API routes.
        //
        // C: We cannot include credentials in cross-origin requests.
        // In this case, we must explicitly list all the origins allowed to make requests in the "Access-Control-Allow-Origin" header,
        // which is challenging for our devops and backend teams. Thus, we do not use the "include" option here.
        // And because of this, the account feature in cross-origin setup will not work.
        //
        // Considering all of the above, we use:
        //   -  The "same-origin" option for all core API requests
        //   -  The "omit" option for all other requests
        //
        // UPDATED:
        // In some scenarios, we need to include credentials for request to non-core API which is on the same origin as the core API.
        // For example, the request to the Stats API which is behind Claudflare authentication.
        // So we use the "same-origin" option for all requests which is the default behavior of fetch API.
        // credentials: apiName === 'core' ? 'same-origin' : 'omit',
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
