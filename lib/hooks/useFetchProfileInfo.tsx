import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';

import fetch from 'lib/client/fetch';

export default function useFetchProfileInfo() {
  return useQuery<unknown, unknown, UserInfo>([ 'profile' ], async() => {
    return fetch('/api/account/profile');
  }, { refetchOnMount: false });
}
