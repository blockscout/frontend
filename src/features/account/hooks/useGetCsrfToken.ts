// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import { getResourceKey } from 'src/api/hooks/useApiQuery';
import useFetch from 'src/api/hooks/useFetch';
import buildUrl from 'src/api/utils/build-url';
import isNeedProxy from 'src/api/utils/is-need-proxy';

import * as cookies from 'src/shared/storage/cookies';

export default function useGetCsrfToken() {
  const nodeApiFetch = useFetch();

  return useQuery({
    queryKey: getResourceKey('core:csrf'),
    queryFn: async() => {
      if (!isNeedProxy()) {
        const url = buildUrl('core:csrf');
        const apiResponse = await fetch(url, { credentials: 'include' });
        const csrfFromHeader = apiResponse.headers.get('x-bs-account-csrf');

        if (!csrfFromHeader) {
          // I am not sure should we log this error or not
          // so I commented it out for now
          // rollbar?.warn('Client fetch failed', {
          //   resource: 'csrf',
          //   status_code: 500,
          //   status_text: 'Unable to obtain csrf token from header',
          // });
          return;
        }

        return { token: csrfFromHeader };
      }

      return nodeApiFetch('/node-api/csrf');
    },
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
