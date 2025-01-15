import React from 'react';

import isBodyAllowed from 'lib/api/isBodyAllowed';
import type { ResourceError, ResourcePath } from 'lib/api/resources';
import { useRollbar } from 'lib/rollbar';

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

    return fetch(path, reqParams).then(response => {

      const isJson = response.headers.get('content-type')?.includes('application/json');

      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
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
              payload: textError,
              status: response.status,
              statusText: response.statusText,
            }),
          );
        }

        return response.json().then(
          (jsonError) => Promise.reject({
            payload: jsonError as Error,
            status: response.status,
            statusText: response.statusText,
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
