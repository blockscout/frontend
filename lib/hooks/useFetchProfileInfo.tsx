import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';
import { QueryKeys } from 'types/client/queries';

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
    return fetch('/api/account/profile');
  }, {
    refetchOnMount: false,
  });
}
