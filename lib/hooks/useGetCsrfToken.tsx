import { useQuery } from '@tanstack/react-query';

import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import { useRollbar } from 'lib/rollbar';

export default function useGetCsrfToken() {
  const nodeApiFetch = useFetch();
  const rollbar = useRollbar();

  return useQuery({
    queryKey: getResourceKey('csrf'),
    queryFn: async() => {
      if (!isNeedProxy()) {
        const url = buildUrl('csrf');
        const apiResponse = await fetch(url, { credentials: 'include' });
        const csrfFromHeader = apiResponse.headers.get('x-bs-account-csrf');

        if (!csrfFromHeader) {
          rollbar?.warn('Client fetch failed', {
            resource: 'csrf',
            status_code: 500,
            status_text: 'Unable to obtain csrf token from header',
          });
          return;
        }

        return { token: csrfFromHeader };
      }

      return nodeApiFetch('/node-api/csrf');
    },
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
