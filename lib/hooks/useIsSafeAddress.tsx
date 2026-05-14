// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import useFetch from 'client/api/hooks/useFetch';

import config from 'configs/app';

const feature = config.features.safe;

export default function useIsSafeAddress(hash: string | undefined): boolean {
  const fetch = useFetch();

  const { data } = useQuery({
    queryKey: [ 'external:safe_transaction_api', hash ],
    queryFn: async() => {
      if (!feature.isEnabled || !hash) {
        return Promise.reject();
      }

      return fetch(`${ feature.apiUrl }/${ hash }`);
    },
    enabled: feature.isEnabled && Boolean(hash),
    refetchOnMount: false,
  });

  return Boolean(data);
}
