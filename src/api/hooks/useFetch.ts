// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useRollbar } from 'src/services/rollbar';

import type { ResourceError, ResourcePath } from '../resources';
import isBodyAllowed from '../utils/is-body-allowed';
import takePrimedFetch from '../utils/primed-fetch';

export interface Params {
  method?: RequestInit['method'];
  headers?: RequestInit['headers'];
  signal?: RequestInit['signal'];
  body?: Record<string, unknown> | FormData;
  credentials?: RequestCredentials;
}

interface Meta {
  resource?: ResourcePath;
  logError?: boolean;
}

export default function useFetch() {
  const rollbar = useRollbar();

  return React.useCallback(<Success, Error>(path: string, params?: Params, meta?: Meta): Promise<Success | ResourceError<Error>> => {
    const _body = params?.body;
    const isFormData = _body instanceof FormData;
    const withBody = isBodyAllowed(params?.method);

    const body: FormData | string | undefined = (() => {
      if (!withBody) {
        return;
      }

      if (isFormData) {
        return _body;
      }

      return JSON.stringify(_body);
    })();

    const reqParams = {
      ...params,
      body,
      headers: {
        ...(withBody && !isFormData ? { 'Content-type': 'application/json' } : undefined),
        ...params?.headers,
      },
    };

    // early-fetch primer: a GET request primed by the inline script in the document may
    // already be in flight — consume it instead of fetching again
    const primedFetch = !params?.method || params.method === 'GET' ? takePrimedFetch(path, reqParams.headers) : undefined;

    return (primedFetch ?? fetch(path, reqParams)).then(response => {

      const isJson = response.headers.get('content-type')?.includes('application/json');

      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          rateLimits: {
            bypassOptions: response.headers.get('bypass-429-option'),
            reset: response.headers.get('x-ratelimit-reset'),
          },
        };

        if (meta?.logError && rollbar) {
          rollbar.warn('Client fetch failed', {
            resource: meta?.resource,
            status_code: error.status,
            status_text: error.statusText,
          });
        }

        if (!isJson) {
          return response.text().then(
            (textError) => Promise.reject({
              ...error,
              payload: textError,
            }),
          );
        }

        return response.json().then(
          (jsonError) => Promise.reject({
            ...error,
            payload: jsonError as Error,
          }),
          () => {
            return Promise.reject(error);
          },
        );

      } else {
        if (isJson) {
          return response.json() as Promise<Success>;
        }

        return Promise.resolve() as Promise<Success>;
      }
    });
  }, [ rollbar ]);
}
