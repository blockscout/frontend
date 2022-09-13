import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';

import fetch from 'lib/client/fetch';

interface Error {
  error?: {
    status?: number;
    statusText?: string;
  };
}

export default function useFetchProfileInfo() {
  return useQuery<unknown, Error, UserInfo>([ 'profile' ], async() => {
    return fetch('/api/account/profile');
  }, {
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (error?.error?.status === 401) {
        // for unauthorized users don't do retry
        return false;
      }

      return failureCount < 2;
    },
  });
}
