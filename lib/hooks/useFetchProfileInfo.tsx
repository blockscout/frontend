import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';

import useFetch from 'lib/hooks/useFetch';

interface Error {
  error?: {
    status?: number;
    statusText?: string;
  };
}

export default function useFetchProfileInfo() {
  const fetch = useFetch();

  return useQuery<unknown, Error, UserInfo>([ 'profile' ], async() => {
    return fetch('/api/account/profile');
  }, {
    refetchOnMount: false,
  });
}
