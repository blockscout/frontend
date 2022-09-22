import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const url = new URL(`/${ router.query.network_type }/${ router.query.network_sub_type }/api/account/v1/user/info`, 'https://blockscout.com');

  return useQuery<unknown, Error, UserInfo>([ 'profile' ], async() => {
    return fetch(url.toString(), { credentials: 'include' });
  }, {
    refetchOnMount: false,
    enabled: Boolean(router.query.network_type && router.query.network_sub_type),
  });
}
