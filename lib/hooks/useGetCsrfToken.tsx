import { useQuery } from '@tanstack/react-query';

import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';

export default function useGetCsrfToken() {
  const nodeApiFetch = useFetch();

  useQuery(getResourceKey('csrf'), async() => {
    if (!isNeedProxy()) {
      const url = buildUrl('csrf');
      const apiResponse = await fetch(url, { credentials: 'include' });
      const csrfFromHeader = apiResponse.headers.get('x-bs-account-csrf');
      // eslint-disable-next-line no-console
      console.log('>>> RESPONSE HEADERS <<<');
      // eslint-disable-next-line no-console
      console.table([ {
        'content-length': apiResponse.headers.get('content-length'),
        'x-bs-account-csrf': csrfFromHeader,
      } ]);

      return csrfFromHeader ? { token: csrfFromHeader } : undefined;
    }

    return nodeApiFetch('/node-api/csrf');
  }, {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
