import * as Sentry from '@sentry/react';
import { useQuery } from '@tanstack/react-query';

import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';

export default function useGetCsrfToken() {
  const nodeApiFetch = useFetch();

  return useQuery({
    queryKey: getResourceKey('csrf'),
    queryFn: async() => {
      if (!isNeedProxy()) {
        const url = buildUrl('csrf');
        const apiResponse = await fetch(url, { credentials: 'include' });
        const csrfFromHeader = apiResponse.headers.get('x-bs-account-csrf');

        if (!csrfFromHeader) {
          Sentry.captureException(new Error('Client fetch failed'), { tags: {
            source: 'fetch',
            'source.resource': 'csrf',
            'status.code': 500,
            'status.text': 'Unable to obtain csrf token from header',
          } });
          return;
        }

        return { token: csrfFromHeader };
      }

      return nodeApiFetch('/node-api/csrf');
    },
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
