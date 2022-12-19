import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
// import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';

interface Error {
  error?: {
    status?: number;
    statusText?: string;
  };
}

export default function useFetchProfileInfo() {
  const fetch = useFetch();

  return useQuery<unknown, Error, UserInfo>([ QueryKeys.profile ], async() => {
    const url = new URL(`/proxy/poa/core/api/account/v1/user/info`, appConfig.baseUrl);
    return fetch(url.toString(), { credentials: 'include' });
  }, {
    refetchOnMount: false,
    // enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}
