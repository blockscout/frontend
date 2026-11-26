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
          return;
        }

        return { token: csrfFromHeader };
      }

      return nodeApiFetch('/node-api/csrf');
    },
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
